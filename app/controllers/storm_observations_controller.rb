class StormObservationsController < ApplicationController
  before_action :find_storm_observation, only: [:show, :edit, :update, :destroy, :update_storm_telegram] #, :get_storm_context]

  def latest_storms
    @telegrams = []
    storms = StormObservation.all.limit(50).order(:id).reverse_order
    storms.each do |s|
      @telegrams << {id: s.id, station_id: s.station_id, created_at: s.created_at.utc.strftime("%d-%m-%Y %H:%M:%S UTC"), telegram_date: s.telegram_date.utc.strftime("%d-%m-%Y %H:%M UTC"), telegram: s.telegram}
    end
    @stations = Station.all.order(:id)
  end

  def storms_4_download
    @init_date = Time.now.strftime("%Y-%m-%d")
  end

  def storm_to_arm_syn
    storm_date = params[:download][:storm_date]
    # telegrams = StormObservation.where("created_at LIKE ?", storm_date+'%').order(:id)
    telegrams = StormObservation.where("telegram_date LIKE ?", storm_date+'%').order(:id)

    total = telegrams.size
    curr_time = Time.now.strftime("%H:%M")
    File.open("tmp/Storm_#{storm_date}.txt",'w+') do |f|
      telegrams.each do |t| # Lugansk? Синоптики помочь не могут 20181026
        puts_storm(f, t, curr_time)
      end
    end
    flash[:success] = "Дата: #{storm_date}; Преобразовано телеграмм из БД ГМЦ: #{total}"
    redirect_to storm_observations_storms_4_arm_syn_path(request.parameters)
  end

  def puts_storm(file, storm, curr_time)
    if storm.station_id == 1 # Donetsk
      icao_code =  'UKCC'
      gild_code = '31'
    else
      icao_code = 'UKDC'
      gild_code = '40'
    end
    if storm.telegram_type == 'ЩЭОЗМ' # finish
      sign_group = 'WOUR'+gild_code
      start_stop = 'AVIA'
    else
      sign_group = 'WWUR'+gild_code
      start_stop = 'STORM'
    end

    file.puts "    >>> #{curr_time} <<<"
    file.puts "333 #{sign_group} #{icao_code} #{storm.created_at.strftime("%d%H%M")}"
    file.puts start_stop
    file.puts storm.telegram[6..-1]
    file.puts "    ============================"
  end

  def storms_4_arm_syn
    @storm_date = params[:download][:storm_date]
  end

  def storms_download_2_arm_syn
    storm_date = params[:storm_date]
    send_file("#{Rails.root}/tmp/Storm_#{storm_date}.txt")
  end

  def get_conversion_params
  end

  def converter
    date_from = params[:interval][:date_from].tr("-", ".")+' 00:00:00'
    date_to = params[:interval][:date_to].tr("-", ".")+' 23:59:59'
    old_telegrams = OldSynopticTelegram.where("Дата >= ? and Дата <= ? and Срок = 'Ш' ", date_from, date_to).order("Дата, Срок")
    stations = Station.station_id_by_code
    selected_telegrams = old_telegrams.size
    wrong_telegrams = 0
    correct_telegrams = 0
    created_telegrams = 0
    updated_telegrams = 0
    skiped_telegrams = 0
    File.open("app/assets/pdf_folder/conversion.txt",'w') do |mylog|
      mylog.puts "Конверсия данных штормовых телеграмм за период с #{date_from} по #{date_to}"
      old_telegrams.each do |t|
        errors = []
        telegram = convert_storm_telegram(t, stations, errors)
        if telegram.present?
          observation = StormObservation.find_by(telegram_date: telegram.telegram_date, station_id: telegram.station_id)
          if observation.present?
            # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{hash_telegram.inspect}")
            if observation.telegram_date.nil? or (observation.telegram_date < telegram.telegram_date)
              json_telegram = telegram.as_json.except('id', 'created_at', 'updated_at')
              observation.update json_telegram
              updated_telegrams += 1
            else
              skiped_telegrams += 1
            end
          else
            observation = StormObservation.new(telegram.as_json)
            observation.save
            created_telegrams += 1
          end
          correct_telegrams += 1
        else
          mylog.puts errors[0]+' => '+t["Дата"]+'->'+t["Телеграмма"]
          wrong_telegrams += 1
        end
      end
      mylog.puts '='*80
      mylog.puts "Всего поступило телеграмм - #{selected_telegrams}"
      mylog.puts "Корректных телеграмм - #{correct_telegrams}: создано - #{created_telegrams}; обновлено - #{updated_telegrams}; пропущено - #{skiped_telegrams}"
      mylog.puts "Ошибочных телеграмм - #{wrong_telegrams}"
    end
    flash[:success] = "Входных телеграмм - #{selected_telegrams}. Корректных телеграмм - #{correct_telegrams} (создано - #{created_telegrams}; обновлено - #{updated_telegrams}; пропущено - #{skiped_telegrams}). Ошибочных телеграмм - #{wrong_telegrams}."
    redirect_to storm_observations_get_conversion_params_path
  end

  def storm_description
    @date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    @date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    if params[:station_id].present?
      @station_id = params[:station_id]
      station = " and station_id = #{@station_id}"
    else
      @station_id = '0'
      station = ''
    end
    sql = "select * from storm_observations where telegram_type in ('ЩЭОЯЮ','ЩЭОЗМ') and telegram_date >= '#{@date_from}' and telegram_date <= '#{@date_to} 23:59:59' #{station} order by telegram_date;"
    data = StormObservation.find_by_sql(sql)
    stops = []
    data.map do |so|
      if so.telegram[24] == '1' # убрать агро-шторма => 2
        # key = so.station_id.to_s.rjust(2, '0')+so.telegram[26,2] # станция явление
        fact = {}
        if so.telegram_type == 'ЩЭОЗМ' # stop
          fact['station_id'] = so.station_id
          fact['warep_code'] = so.telegram[26,2]
          fact['fact_date'] = so.telegram_date
          fact['text'] = so.telegram
          stops << fact
        end
      end
    end
    @telegrams = []
    data.map do |so|
      if so.telegram[24] == '1'
        telegram = {}
        # telegram = {station_id: so.station_id, warep_code: so.telegram[26,2]}
        if so.telegram_type == 'ЩЭОЯЮ' # start
          telegram = {'station_id' => so.station_id, 'warep_code' => so.telegram[26,2], 'start_date' => so.telegram_date, 'start_text' => so.telegram}
          stops.each do |f|
            if telegram['station_id'] == f['station_id'] and telegram['warep_code'] == f['warep_code'] and telegram['start_date'] < f['fact_date']
              telegram['stop_date'] = f['fact_date']
              telegram['stop_text'] = f['text']
              break
            end
          end
          @telegrams << telegram
        else
          telegram = {station_id: so.station_id, warep_code: so.telegram[26,2], stop_date: so.telegram_date, stop_text: so.telegram}
          if not stop_telegram_used(telegram, @telegrams)
            @telegrams << telegram
          end
        end
      end
    end
    @stations = Station.stations_array_with_any
    respond_to do |format|
      format.html
      format.json { render json: {telegrams: @telegrams} }
    end
  end

  def stop_telegram_used(telegram, telegrams)
    # puts '>>>>>>>>>>>>>'+telegram.inspect
    # puts '+++++++++++++'+telegrams.inspect
    telegrams.each do |t|
      if t['station_id'] == telegram[:station_id] and t['warep_code'] == telegram[:warep_code] and t['stop_date'] == telegram[:stop_date]
        return true
      end
    end
    return false
  end

  def search_storm_telegrams
    @date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    @date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    if params[:storm_type].present?
      if params[:storm_type] == 'Агро'
        and_storm_type = " and telegram REGEXP '.{5} WAREP [0-9]{5} [0-9]{6}2'"
      else
        and_storm_type = " and telegram_type = '#{params[:storm_type]}'"
        @storm_type = params[:storm_type]
      end
    else
      and_storm_type = ''
      @storm_type = ''
    end
    if params[:station_id].present?
      @station_id = params[:station_id]
      station = " and station_id = #{@station_id}"
    else
      @station_id = '0'
      station = ''
    end
    if params[:text].present?
      @text = params[:text]
      and_text = " and telegram like '%#{@text}%'"
    else
      @text = ''
      and_text = ''
    end

    sql = "select * from storm_observations where telegram_date >= '#{@date_from}' and telegram_date <= '#{@date_to} 23:59:59' #{station} #{and_storm_type} #{and_text} order by telegram_date desc;"
    # 20190610 Prach
    # 20190618 KMA
    # sql = "select * from storm_observations where created_at >= '#{@date_from}' and created_at <= '#{@date_to} 23:59:59' #{station} #{and_storm_type} #{and_text} order by created_at desc;"
    tlgs = StormObservation.find_by_sql(sql)
    @stations = Station.stations_array_with_any
    @telegrams = storm_fields_short_list(tlgs)
    respond_to do |format|
      format.html
      format.json { render json: {telegrams: @telegrams} }
    end
  end

  def storm_fields_short_list(full_list)
    # stations = Station.all.order(:id)
    full_list.map do |rec|
      {id: rec.id, date: rec.telegram_date.utc, station_name: rec.station.name, telegram: rec.telegram, input_date: rec.created_at.utc}  # 20190619 add utc for date
      # {id: rec.id, date: rec.created_at.localtime, station_name: stations[rec.station_id-1].name, telegram: rec.telegram, event_date: rec.telegram_date} 20190618 KMA
    end
  end

  def index
    @storm_observations = StormObservation.paginate(page: params[:page]).order(:telegram_date, :created_at).reverse_order
  end

  def show
    # code_warep = @storm_observation.telegram[26,2].to_i
    # case code_warep
    #   when 11, 12, 17, 18, 19, 36, 78
    # end
    date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    add_param = params[:storm_type].present? ? "&term=#{params[:storm_type]}" : ''
    station = params[:station_id].present? ? "&station_id=#{params[:station_id]}" : ''
    text = params[:text].present? ? "&text=#{params[:text]}" : ''
    @code_warep_positions = @storm_observation.telegram.gsub(/ \d\d[ =]/).map { Regexp.last_match.begin(0)+1 }
    if @code_warep_positions.size == 0
      @code_warep_positions[0] = 26
    end
    @search_link = "/storm_observations/search_storm_telegrams?telegram_type=storm&date_from=#{date_from}&date_to=#{date_to}#{station}#{text}#{add_param}"
    @actions = Audit.where("auditable_id = ? and auditable_type = 'StormObservation'", @storm_observation.id)
  end

  def new
    @storm_observation = StormObservation.new
  end

  def input_storm_rf
    stations = Station.all.order(:name)
    @stations = stations.map {|s| {label: s.name, value: s.code, id: s.id}}
    @telegrams = StormObservation.where("telegram_type like 'W%'").order(telegram_date: :desc).limit(20)
    # @telegrams = []
  end

  def create_storm_rf
    observation = StormObservation.new(storm_observation_params)
    observation.day_event = observation.telegram[10,2] 
    observation.hour_event = observation.telegram[12,2]  
    observation.minute_event = observation.telegram[14,2] 
    observation.telegram_date = "20#{observation.telegram[5,2]}-#{observation.telegram[7,2]}-#{observation.telegram[10,2]} #{observation.telegram[12,2]}:#{observation.telegram[14,2]}:00"
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{observation.telegram_date}")
    if observation.save
      ActionCable.server.broadcast("synoptic_telegram_channel", {telegram: observation, tlgType: 'storm'})
      User.where(role: ['synoptic', 'vip']).each do |synoptic|
        ActionCable.server.broadcast("storm_telegram_user_#{synoptic.id}", {sound: true, telegram_id: observation.id})
      end
      last_telegrams_rf = StormObservation.where("telegram_type like 'W%'").order(telegram_date: :desc).limit(20)
      render json: {telegrams: last_telegrams_rf}
    else
      render json: {errors: observation.errors.messages}, status: :unprocessable_entity
    end
  end

  def input_storm_telegrams
    @stations = Station.all.order(:name)
    @telegrams = StormObservation.short_last_50_telegrams(current_user)
    @input_mode = params[:input_mode]
  end

  def create
    @storm_observation = StormObservation.new(storm_observation_params)
    tlg_as_array = @storm_observation.telegram.split(' ')
    @storm_observation.day_event = tlg_as_array[3][0,2].to_i
    @storm_observation.hour_event = tlg_as_array[3][2,2].to_i if tlg_as_array[3][2,2] != '//'
    @storm_observation.minute_event = tlg_as_array[3][4,2].to_i if tlg_as_array[3][4,2] != '//'
    ret = true
    if @storm_observation.telegram_type != @storm_observation.telegram[0,5]
      flash[:danger] = 'Ошибка в типе телеграммы'
      ret = false
    end
    if ret and @storm_observation.save # and synoptic_telegram.save
      flash[:success] = "Создана штормовая телеграмма"
      redirect_to storm_observations_path
    else
      render 'new'
    end
  end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")

  def create_storm_telegram
    date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00 UTC') : Time.now.utc
    # yyyy_mm = date_dev.year.to_s + '-' + date_dev.month.to_s.rjust(2, '0') + '%'
    # с Н.В. 2018.03.13 согласован интервал в 20 минут

    # sql = "select * from storm_observations where station_id = #{params[:storm_observation][:station_id]} and telegram_type = '#{params[:storm_observation][:telegram_type]}' and day_event = #{params[:storm_observation][:day_event]} and hour_event = #{params[:storm_observation][:hour_event]} and minute_event = #{params[:storm_observation][:minute_event]} and telegram_date > '#{left_time}' order by telegram_date desc"
    # 20181121
    if params[:input_mode] == 'direct'
      sql =  "select * from storm_observations where station_id = #{params[:storm_observation][:station_id]} 
              and telegram_type = '#{params[:storm_observation][:telegram_type]}' 
              and substr(telegram,26,2) = #{params[:storm_observation][:telegram][26,2]} # BLN 2021.02.11
              and day_event = #{params[:storm_observation][:day_event]} 
              and hour_event = #{params[:storm_observation][:hour_event]} 
              and minute_event = #{params[:storm_observation][:minute_event]} order by telegram_date desc"
    else
      left_time = date_dev-20.minutes
      sql =  "select * from storm_observations where station_id = #{params[:storm_observation][:station_id]} 
              and telegram_type = '#{params[:storm_observation][:telegram_type]}' 
              and day_event = #{params[:storm_observation][:day_event]} 
              and hour_event = #{params[:storm_observation][:hour_event]} 
              and minute_event = #{params[:storm_observation][:minute_event]} 
              and substr(telegram,26,2) = #{params[:storm_observation][:telegram][26,2]} # BLN 2021.02.11
              and created_at > '#{left_time}' order by telegram_date desc"
    end
    telegram = StormObservation.find_by_sql(sql).first
    # telegram = StormObservation.find_by(station_id: params[:storm_observation][:station_id], telegram_type: params[:storm_observation][:telegram_type], day_event: params[:storm_observation][:day_event], hour_event: params[:storm_observation][:hour_event], minute_event: params[:storm_observation][:minute_event])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if telegram.present?
      if telegram.update storm_observation_params
        last_telegrams = StormObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams,
                      tlgType: 'storm',
                      inputMode: params[:input_mode],
                      currDate: telegram.telegram_date,
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = StormObservation.new(storm_observation_params)
      telegram.telegram_date = get_event_date(telegram, date_dev)
      if telegram.save
        # storm_4_arm_syn(telegram)
        # new_telegram = {id: telegram.id, date: telegram.telegram_date, station_name: telegram.station.name, telegram: telegram.telegram}
        new_telegram = {id: telegram.id, date: telegram.telegram_date.utc, station_name: telegram.station.name, telegram: telegram.telegram, created_at: telegram.created_at.utc, station_id: telegram.station_id}
        ActionCable.server.broadcast("synoptic_telegram_channel", {telegram: new_telegram, tlgType: 'storm'})
        User.where(role: ['synoptic', 'vip']).each do |synoptic|
          # "storm_telegram_created",         #20190724 sound: true, telegram: new_telegram 20190806
          ActionCable.server.broadcast("storm_telegram_user_#{synoptic.id}", {sound: true, telegram_id: telegram.id})
        end
        last_telegrams = StormObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams,
                      tlgType: 'storm',
                      inputMode: params[:input_mode],
                      currDate: telegram.telegram_date,
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def get_event_date(telegram, date_dev)
    if date_dev.day == telegram.day_event
      year = date_dev.year
      month = date_dev.month
      day = date_dev.day
    else
      prev_day = date_dev - 1.day # Согласовано с Ки... М.А 2018.11.08
      year = prev_day.year
      month = prev_day.month
      day = prev_day.day
    end
    return Time.parse("#{year}-#{month}-#{day} #{telegram.hour_event}:#{telegram.minute_event}:00 UTC")
  end

  def storm_4_arm_syn storm
    curr_time = Time.now.strftime("%H:%M")
    storm_date = storm.telegram_date.strftime("%Y-%m-%d")
    year = storm_date[0,4]
    month = storm_date[5,2]
    day = storm_date[8,2]
    File.open("tmp/Storm_#{storm_date}.txt",'a+') do |f|
      puts_storm(f, storm, curr_time)
    end
    # copy file to ARM_SYN
    Net::SSH.start("10.105.24.5", "admin") do |session|
      # Net::SSH.start("10.105.24.5", "admin", :password => "") do |session|
      session.scp.download! "/tmp/Storm_#{storm_date}.txt", "d:/DATA/ARM_SIN/INPUT/#{year}_#{month}/#{day}_#{month}/Storm_#{day}.txt"
    end
  end

  def get_last_telegrams
    telegrams = StormObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'storm'}
  end

  def edit
  end

  def update
    if not @storm_observation.update storm_observation_params
      render :action => :edit
    else
      redirect_to '/storm_observations/input_storm_telegrams'
    end
  end

  def update_storm_telegram
    if @storm_observation.update storm_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end

  def destroy
    @storm_observation.destroy
    flash[:success] = "Удалена штормовая телеграмма"
    redirect_to storm_observations_path
  end

  def get_storm_context
    storm_observation = StormObservation.find(params[:id])
    station_id = storm_observation.station_id
    occurrence_date = storm_observation.telegram_date
    d1 = occurrence_date - 6.hours
    hour1 = d1.hour / 3 * 3
    start_date = DateTime.new(d1.year, d1.month, d1.day, hour1)
    stop_date = start_date + 10.hours
    obs = SynopticObservation.where("station_id = ? and observed_at between ? and ? ", station_id, start_date, stop_date).order(:observed_at)
    render json: {storm_context: obs}
  end

  private
    def storm_observation_params
      params.require(:storm_observation).permit(:telegram_type, :station_id, :day_event, :hour_event, :minute_event, :telegram, :telegram_date) #, :code_warep)
      # params.require(:storm_observation).permit(:registred_at, :telegram_type, :station_id, :day_event, :hour_event, :minute_event, :telegram, :telegram_date)
      # :code_warep, :wind_direction, :wind_speed_avg, :wind_speed_max
    end

    def find_storm_observation
      @storm_observation = StormObservation.find(params[:id])
    end

    def convert_storm_telegram(old_telegram, stations, errors)
      groups = old_telegram["Телеграмма"].tr('=', '').split(' ')
      new_telegram = StormObservation.new
      new_telegram.telegram_date = Time.parse(old_telegram["Дата"]+' UTC')
      new_telegram.telegram = old_telegram["Телеграмма"]
      if (groups[0] == 'ЩЭОЯЮ') or (groups[0] == 'ЩЭОЗМ')
        new_telegram.telegram_type = groups[0]
      else
        errors << "Ошибка в различительной группе"
        return nil
      end
      if groups[1] == 'WAREP'
      else
        errors << "Ошибка в группе WAREP"
        return nil
      end
      code_station = groups[2].to_i
      if stations[code_station].present?
        new_telegram.station_id = stations[code_station]
      else
        errors << "Ошибка в коде станции - <#{code_station}>"
        return nil
      end
      if (groups[3].length == 7) and (groups[3][6] == '1')
        new_telegram.day_event = groups[3][0,2]
        new_telegram.hour_event = groups[3][2,2]
        new_telegram.minute_event = groups[3][4,2]
      else
        errors << "Ошибка в группе времени явления"
        return nil
      end
      new_telegram
    end

    # def fields_short_list(full_list)
    #   full_list.map do |rec|
    #     {id: rec.id, date: rec.telegram_date, station_name: rec.station.name, telegram: rec.telegram}
    #   end
    # end
end
