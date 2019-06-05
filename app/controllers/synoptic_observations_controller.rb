class SynopticObservationsController < ApplicationController
  before_action :logged_user?
  # before_filter :require_observer_or_technicist
  before_action :find_synoptic_observation, only: [:show, :update_synoptic_telegram, :destroy] 
  
  def destroy
    @synoptic_observation.destroy
    flash[:success] = "Телеграмма удалена"
    redirect_to synoptic_observations_path
  end
  
  def teploenergo
    @year = params[:year].present? ? params[:year] : Time.now.utc.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    sql = "select date, station_id, avg(temperature) temperature from synoptic_observations where date like '#{@year}-#{@month}%' and station_id in (1,2,3,4,5) group by date, station_id;"
    db_temperatures = SynopticObservation.find_by_sql(sql)
    @temperatures = {}
    db_temperatures.each {|t|
      key = t.date.day.to_s.rjust(2, '0')+'-'+t.station_id.to_s
      @temperatures[key] = t.temperature
    }
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{@temperatures.inspect}") 
    respond_to do |format|
      format.html 
      format.pdf do
        # station_name = Station.find(params[:station_id]).name
        pdf = Teploenergo.new(@temperatures, @year, @month)
        send_data pdf.render, filename: "teploenergo_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
      format.json do 
        render json: {temperatures: @temperatures}
      end
    end
  end
  
  def telegrams_4_download
    @date = (Time.now-3.hours).utc.strftime("%Y-%m-%d") # предыдущий срок
  end
  
  def arm_sin_data_fetch
    # 08001 34824 41595 80902 10068 20061 30128 40134 58003 71022 885// 55555 11005=  for arm_sin
    # ЩЭСМЮ 34712 32997 22503 10245 20175 39941 40020 53... from hmc
    # 33088,2018,08,02,00,00,AAXX 02001 33088 32997 10000 10188 20182 30034 40217 58001 81070 555 1/018= from ogimet
    date =  params[:download][:date] 
    term = params[:download][:term]
    year = date[0, 4]
    month = date[5,2]
    day = date[8,2]
    our_synoptic_observations = SynopticObservation.where("date = ? and term = ?", date, term.to_i)
    telegrams = []
    our_synoptic_observations.each do |o|
      telegrams << make_row_4_download(day, term, o.telegram)
    end
    our_telegrams_num = telegrams.size

    # csv_data = Net::HTTP.get(URI.parse('http://www.ogimet.com/cgi-bin/getsynop?begin=201704300300&end=201704300300&state=Ukr'))
    url = "http://www.ogimet.com/cgi-bin/getsynop?begin="+year+month+day+term+'00&end='+year+month+day+term+'00' #&state=Ukr' 20181004 directive Boyko
    csv_data = Net::HTTP.get(URI.parse(url))
    web_rows = csv_data.split("\n")
    rows = []
    web_rows.each do |t|
      if t =~ /AAXX/
        rows << t[28..-1].gsub(/ 333 /, " 33333 ").gsub(/ 555 /, " 55555 ")
      end
    end
    web_telegrams_num = rows.size
    rows = rows + telegrams
    directory_name = "tmp/#{year}_#{month}"
    Dir.mkdir(directory_name) unless File.exists?(directory_name)
    directory_name = "tmp/#{year}_#{month}/#{day}_#{month}"
    Dir.mkdir(directory_name) unless File.exists?(directory_name)
    total = 0
    File.open("tmp/#{year}_#{month}/#{day}_#{month}/AAXX.#{term}",'w+') do |f|
      rows.each do |t|
        f.puts t
        total += 1
      end
    end
    flash[:success] = "Дата: #{date}; срок: #{term}; телеграмм из БД ГМЦ: #{our_telegrams_num}; телеграмм из БД ogimet: #{web_telegrams_num}; записано телеграмм: #{total}"
    redirect_to synoptic_observations_arm_sin_files_list_path(request.parameters)
    
  end
  
  def arm_sin_files_list
    date = params[:download][:date] 
    term = params[:download][:term]
    @list = [{date: date, term: term}]
  end
  
  def download_arm_sin_file
    date = params[:date] 
    term = params[:term]
    year = date[0, 4]
    month = date[5,2]
    day = date[8,2]
    send_file("#{Rails.root}/tmp/#{year}_#{month}/#{day}_#{month}/AAXX.#{term}")
  end
  
  def get_meteoparams
    @year = params[:year].present? ? params[:year] :  Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    @stations = Station.all.order(:name)
    @meteoparams = []
    respond_to do |format|
      format.html 
      format.pdf do
        station_name = Station.find(params[:station_id]).name
        pdf = Meteoparams.new(fetch_meteoparams(params[:station_id]), @year, @month, station_name)
        send_data pdf.render, filename: "meteoparams_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
      format.json do 
        render json: fetch_meteoparams(params[:station_id]) 
      end
    end
  end
  
  def fetch_meteoparams(station_id)
    from_date = Time.parse(@year+'-'+@month+'-01 00:00:00')-3.hours
    from_date_to_s = from_date.strftime('%Y-%m-%d %H:%M:%S')
    to_date = Time.parse(@year+'-'+@month+'-01 00:00:00')+1.month-6.hours
    to_date_to_s = to_date.strftime('%Y-%m-%d %H:%M:%S')
    sql = "select id, date, term, temperature, wind_direction, wind_speed_avg, weather_in_term, pressure_at_station_level from synoptic_observations where observed_at > '#{from_date_to_s}' and observed_at < '#{to_date_to_s}' and station_id = #{station_id} and term in (3,9,15,21) order by observed_at, term;"
    row_meteoparams = SynopticObservation.find_by_sql(sql)
    meteoparams = []
    chem_term = {21 =>'21/01', 3 =>'03/07', 9 =>'09/13', 15 =>'15/19' }
    row_meteoparams.each do |mp|
      new_mp = {}
      new_mp[:id] = mp.id
      new_mp[:date] = mp.date
      new_mp[:term] = chem_term[mp.term]
      new_mp[:temperature] = mp.temperature
      new_mp[:wind_direction] = mp.wind_direction*10
      new_mp[:wind_speed_avg] = mp.wind_speed_avg
      new_mp[:weather] = SynopticObservation::WEATHER_IN_TERM[mp.weather_in_term] if mp.weather_in_term.present?
      new_mp[:pressure] = mp.pressure_at_station_level.present? ? "#{mp.pressure_at_station_level} / #{(mp.pressure_at_station_level/1.334).round}" : ''
      meteoparams << new_mp
    end
    meteoparams
  end

  def get_conversion_params
  end
  
  def converter
    date_from = params[:interval][:date_from].tr("-", ".")+' 00:00:00'
    date_to = params[:interval][:date_to].tr("-", ".")+' 23:59:59'
    old_telegrams = OldSynopticTelegram.where("Дата >= ? and Дата <= ? and Срок in (?) ", date_from, date_to, OldSynopticTelegram::TERMS).order("Дата, Срок")
    stations = Station.station_id_by_code
    selected_telegrams = old_telegrams.size
    wrong_telegrams = 0
    correct_telegrams = 0
    created_telegrams = 0
    updated_telegrams = 0
    skiped_telegrams = 0
    # File.open("app/assets/pdf_folder/conversion.txt",'w') do |mylog|
    File.open("tmp/synoptic_conversion_protocol.txt",'w') do |mylog|
      mylog.puts "Конверсия данных синоптических телеграмм за период с #{date_from} по #{date_to}"
      old_telegrams.each do |t|
        errors = []
        telegram = convert_synoptic_telegram(t, stations, errors)
        if telegram.present?
          observation = SynopticObservation.find_by(date: telegram.date, term: telegram.term, station_id: telegram.station_id)
          if observation.present?
            # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{hash_telegram.inspect}") 
            if observation.observed_at.nil? or (observation.observed_at < telegram.observed_at) 
              json_telegram = telegram.as_json.except('id', 'created_at', 'updated_at')
              observation.update_attributes json_telegram 
              updated_telegrams += 1
            else
              skiped_telegrams += 1
            end
          else
            observation = SynopticObservation.new(telegram.as_json)
            observation.save
            created_telegrams += 1
          end
          correct_telegrams += 1
        else
          mylog.puts errors[0]+' => '+t["Дата"]+'->'+t["Срок"]+'->'+t["Телеграмма"]
          wrong_telegrams += 1
        end
      end
      mylog.puts '='*80
      mylog.puts "Всего поступило телеграмм - #{selected_telegrams}"
      mylog.puts "Корректных телеграмм - #{correct_telegrams}: создано - #{created_telegrams}; обновлено - #{updated_telegrams}; пропущено - #{skiped_telegrams}"
      mylog.puts "Ошибочных телеграмм - #{wrong_telegrams}"
    end
    flash[:success] = "Входных телеграмм - #{selected_telegrams}. Корректных телеграмм - #{correct_telegrams} (создано - #{created_telegrams}; обновлено - #{updated_telegrams}; пропущено - #{skiped_telegrams}). Ошибочных телеграмм - #{wrong_telegrams}."
    redirect_to synoptic_observations_get_conversion_params_path
  end
  
  def conversion_log_download
    send_file("#{Rails.root}/tmp/synoptic_conversion_protocol.txt")
  end
  
  def search_synoptic_telegrams
    @date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    @date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    if params[:term].present?
      @term =  params[:term]
      and_term = " and term = #{@term}"
    else 
      @term = '99'
      and_term = ''
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
       
    sql = "select * from synoptic_observations where observed_at >= '#{@date_from}' and observed_at <= '#{@date_to} 23:59:59' #{and_term} #{station} #{and_text} order by observed_at desc;"
    tlgs = SynopticObservation.find_by_sql(sql)
    @stations = Station.stations_array_with_any
    @telegrams = fields_short_list(tlgs)
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{@telegrams.inspect}")
    respond_to do |format|
      format.html 
      format.json { render json: {telegrams: @telegrams} }
    end
  end

  # def index_on_tab
  # end
  
  def index
    @synoptic_observations = SynopticObservation.paginate(page: params[:page]).order(:observed_at, :term).reverse_order
  end
  
  def synoptic_storm_telegrams
    sql = "SELECT created_at, observed_at as date_rep, term as fterm, station_id, telegram from synoptic_observations union select created_at, telegram_date as date_rep, 'Ш' as fterm, station_id, telegram from storm_observations order by date_rep desc, created_at desc limit 100;"
    @telegrams = SynopticObservation.find_by_sql(sql)
  end
    
  def show
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{params.inspect}")
    date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    term = params[:term].present? ? "&term=#{params[:term]}" : ''
    station = params[:station_id].present? ? "&station_id=#{params[:station_id]}" : ''
    text = params[:text].present? ? "&text=#{params[:text]}" : ''
    @search_link = "/search_synoptic_telegrams?telegram_type=synoptic&date_from=#{date_from}&date_to=#{date_to}#{station}#{text}#{term}"
    @actions = Audit.where("auditable_id = ? and auditable_type = 'SynopticObservation'", @synoptic_observation.id)
  end
  
  def new
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{current_user.inspect}")
    @stations = Station.all.order(:name)
    @last_telegrams = SynopticObservation.short_last_50_telegrams(current_user)
  end
  
  def create_synoptic_telegram
    date = params[:input_mode] == 'direct' ? params[:date] : Time.now.utc.strftime("%Y-%m-%d")
    term = params[:input_mode] == 'direct' ? params[:observation][:term] : Time.now.utc.hour / 3 * 3
    station_id = params[:observation][:station_id]
    telegram = SynopticObservation.find_by(date: date, term: term, station_id: station_id)
    if telegram.present?
      if telegram.update_attributes observation_params
        # new_telegram = {id: telegram.id, date: telegram.observed_at, term: term, station_name: telegram.station.name, telegram: telegram.telegram}
        # ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'synoptic'
        # 2018.12.29
        last_telegrams = SynopticObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'synoptic', 
                      currDate: Time.now.utc.strftime("%Y-%m-%d"), 
                      inputMode: params[:input_mode], 
                      errors: ["Телеграмма обновлена"]}
      else
        render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
      end
    else
      telegram = SynopticObservation.new(observation_params)
      telegram.observed_at = params[:input_mode] == 'direct' ? Time.parse(date+' '+term+':01:00 UTC') : Time.now.utc # 20180413 added UTC
      telegram.date = date
      telegram.term = term.to_i
      # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
      if telegram.save
        new_telegram = {id: telegram.id, date: telegram.observed_at, term: term, station_name: telegram.station.name, telegram: telegram.telegram}
        ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'synoptic'
        last_telegrams = SynopticObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, tlgType: 'synoptic', currDate: telegram.date, inputMode: params[:input_mode], errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def update_synoptic_telegram
    if @synoptic_observation.update_attributes observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{@synoptic_observation.inspect}")
    # Rails.logger.debug("My object+++++++++++++++: #{params[:observation].inspect}")
  end
  
  def daily_avg_temp
    @calc_date = params[:calc_date].present? ? params[:calc_date] : Time.now.strftime("%Y-%m-%d")
    temperatures = get_daily_avg_temperatures(@calc_date)
    # temperatures = get_avg_temperatures(@calc_date)
    @temperatures_utc = temperatures[:utc]
    @temperatures_local = temperatures[:local]
    respond_to do |format|
      format.html 
      # format.pdf do
      #   pdf = Teploenergo.new(@temperatures, @year, @month)
      #   send_data pdf.render, filename: "teploenergo_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      # end
      format.json do 
        render json: {temperaturesUtc: @temperatures_utc, temperaturesLocal: @temperatures_local, calcDate: @calc_date}
      end
    end
  end
  def get_daily_avg_temperatures(date)
    date_prev = ((date.to_date) - 1.day).strftime("%Y-%m-%d")+' 21'
    temp_local = SynopticObservation.select(:station_id, :term, :temperature).
      where("observed_at > ? and observed_at < ? and station_id not in (6,9)", date_prev, date+' 20').order(:station_id, :date, :term)
    local = calc_daily_avg_temps(temp_local)
    ret = {}
    ret[:local] = local
    temp_utc = SynopticObservation.select(:station_id, :term, :temperature).where("date = ? and station_id not in (6,9)", date).order(:station_id, :term)
    utc = calc_daily_avg_temps(temp_utc)
    ret[:utc] = utc
    ret
  end
  def calc_daily_avg_temps(observations)
    a = [] 
    observations.each {|tl|
      s=tl.station_id
      a[s] ||= []
      t=tl.term
      a[s][t] = tl.temperature
    }
    a[11] = [] 
    a[12] = [] 
    nt = [] 
    nr = [] 
    (1..10).each do |s|
      if a[s].present?
        arr = a[s].compact
        a[s][22] = (arr.reduce(:+) / arr.size.to_f).round(1) if arr.size > 0
        [21,0,3,6,9,12,15,18,22].each do |t|
          if a[s][t].present?
            a[11][t] ||=0
            a[11][t] += a[s][t]
            nt[t] ||=0
            nt[t] += 1
            if [1,2,3,10].include?(s)
              a[12][t] ||=0
              a[12][t] += a[s][t]
              nr[t] ||=0
              nr[t] += 1
            end
          end
        end
      end
    end
    [21,0,3,6,9,12,15,18,22].each do |t|
      a[11][t] = (a[11][t] / nt[t]).round(1) if nt[t].present? and nt[t]>0
      a[12][t] = (a[12][t] / nr[t]).round(1) if nr[t].present? and nr[t]>0
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{a.inspect}")
    a
  end
  def get_avg_temperatures(date)
    date_prev = ((date.to_date) - 1.day).strftime("%Y-%m-%d")+' 21'
    temp_local = SynopticObservation.select(:station_id, :term, :temperature).
      where("observed_at > ? and observed_at < ? and station_id not in (6,9)", date_prev, date+' 20').order(:station_id, :date, :term)
    a = Hash.new(nil)
    temp_local.each {|hd|
      a[[hd.station_id, hd.term]] = hd.temperature
    }
    ret = {}
    ret[:local] = a
    temp_utc = SynopticObservation.select(:station_id, :term, :temperature).where("date = ? and station_id not in (6,9)", date).order(:station_id, :term)
    a = Hash.new(nil)
    temp_utc.each {|hd|
      a[[hd.station_id, hd.term]] = hd.temperature
    }
    ret[:utc] =a
    ret    
  end
  
  def month_avg_temp
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    @temperatures = get_month_avg_temp(@year, @month)
    respond_to do |format|
      format.html 
      # format.pdf do
      #   pdf = Teploenergo.new(@temperatures, @year, @month)
      #   send_data pdf.render, filename: "teploenergo_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      # end
      format.json do 
        render json: {temperatures: @temperatures}
      end
    end
  end
  def get_month_avg_temp(year, month)
    ret = []
    fd = (year+'-'+month+'-01').to_date
    (fd.day..fd.end_of_month.day).each do|d|
      curr_date = year+'-'+month+'-'+(d>9? d.to_s : '0'+d.to_s)
      ret[d] = avg_temps(curr_date)
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{ret.inspect}")
    num_days = fd.end_of_month.day
    im = Array.new(11,0)
    i1 = Array.new(11,0)
    i2 = Array.new(11,0)
    i3 = Array.new(11,0)
    ret[num_days+1] = Array.new(11,0)
    ret[num_days+1][0] = nil
    ret[num_days+2] = Array.new(11,0)
    ret[num_days+2][0] = nil
    ret[num_days+3] = Array.new(11,0)
    ret[num_days+3][0] = nil
    ret[num_days+4] = Array.new(11,0)
    ret[num_days+4][0] = nil
    
    (1..num_days).each do |d|
      arr = ret[d].compact
      ret[d][11] = (arr.reduce(:+) / arr.size.to_f).round(1) if arr.size > 0
      arr = []
      arr << ret[d][1] << ret[d][2] << ret[d][3] << ret[d][10]
      arr = arr.compact
      ret[d][12] = (arr.reduce(:+) / arr.size.to_f).round(1) if arr.size > 0
      (1..10).each do |s|
        if ret[d][s].present?
          ret[num_days+4][s] += ret[d][s] # month
          im[s] += 1
          if d<11
            ret[num_days+1][s] += ret[d][s] # 1D
            i1[s] += 1
          elsif d<21
            ret[num_days+2][s] += ret[d][s] # 2D
            i2[s] += 1
          else
            ret[num_days+3][s] += ret[d][s] # 3D
            i3[s] += 1
          end  
        end
      end
    end
    (1..10).each do |s|
      if i1[s] > 0
        ret[num_days+1][s] = (ret[num_days+1][s]/i1[s]).round(1)
      else
        ret[num_days+1][s] = nil
      end
      if i2[s] > 0
        ret[num_days+2][s] = (ret[num_days+2][s]/i2[s]).round(1)
      else
        ret[num_days+2][s] = nil
      end
      if i3[s] > 0
        ret[num_days+3][s] = (ret[num_days+3][s]/i3[s]).round(1)
      else
        ret[num_days+3][s] = nil
      end
      if im[s]>0
        ret[num_days+4][s] = (ret[num_days+4][s]/im[s]).round(1)
      else
        ret[num_days+4][s] = nil
      end
    end
    (1..4).each do |i|
      arr = ret[num_days+i].compact
      ret[num_days+i][11] = (arr.reduce(:+) / arr.size.to_f).round(1) if arr.size > 0
      arr = []
      arr << ret[num_days+i][1] << ret[num_days+i][2] << ret[num_days+i][3] << ret[num_days+i][10]
      arr = arr.compact
      ret[num_days+i][12] = (arr.reduce(:+) / arr.size.to_f).round(1) if arr.size > 0
    end
    ret
  end
  def avg_temps(curr_date)
    prev_date = curr_date.to_date - 1.day
    rows = SynopticObservation.select("station_id, avg(temperature) temperature").
      where("observed_at > ? AND observed_at < ? AND station_id NOT IN (6,9)", prev_date.strftime("%Y-%m-%d")+' 20', curr_date+' 19').group(:station_id)
    ret = []
    rows.each {|r| ret[r.station_id] = r.temperature}
    ret
    # select station_id, avg(temperature) from synoptic_observations where station_id not in (6,9) and observed_at > '2017-02-17 20' and observed_at < '2017-02-18 19' group  by  station_id;
  end
  
  def heat_donbass_show
    @calc_date = params[:calc_date].present? ? params[:calc_date] : Time.now.strftime("%Y-%m-%d")
    @temperatures = get_temperatures(@calc_date) 
  end
  
  def heat_donbass_rx
    @calc_date = params[:calc_date].present? ? params[:calc_date] : Time.now.strftime("%Y-%m-%d")
    @temperatures = get_temperatures(@calc_date) 
  end
  
  def get_temps
    calc_date = params[:calc_date].present? ? params[:calc_date] : Time.now.strftime("%Y-%m-%d")
    temperatures = get_temperatures(calc_date)
    render json: {temperatures: temperatures, calcDate: calc_date}
  end
  
  def input_synoptic_telegrams
    @stations = Station.all.order(:name)
    @telegrams = SynopticObservation.short_last_50_telegrams(current_user)
    @term = (Time.now.utc.hour/3*3).to_s.rjust(2, '0')
    @input_mode = params[:input_mode]
    @code_station = current_user.code_station.to_s
  end
  
  def get_last_telegrams
    telegrams = SynopticObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'synoptic'}
  end

  private
    def get_temperatures(date)
      heat_data = SynopticObservation.select(:id, :station_id, :term, :temperature).where("date like ? and station_id in (1, 2, 3, 4, 5)", date).order(:station_id, :term)
      a = Hash.new(nil)
      heat_data.each {|hd|
        a[[hd.station_id, hd.term]] = hd.temperature
      }
      a
    end
    
    def find_synoptic_observation
      @synoptic_observation = SynopticObservation.find(params[:id])
    end
    
    def observation_params
      params.require(:observation).permit(:date, :term, :telegram, :station_id, :cloud_base_height,
        :visibility_range, :cloud_amount_1, :wind_direction, :wind_speed_avg, :temperature, :temperature_dew_point, 
        :pressure_at_station_level, :pressure_at_sea_level, :pressure_tendency_characteristic, :pressure_tendency,
        :precipitation_1, :precipitation_time_range_1, :weather_in_term, :weather_past_1, :weather_past_2,
        :cloud_amount_2, :clouds_1, :clouds_2, :clouds_3, :temperature_dey_max, :temperature_night_min, 
        :underlying_surface_сondition, :snow_cover_height, :sunshine_duration, :cloud_amount_3, :cloud_form,
        :cloud_height, :weather_data_add, :soil_surface_condition_1, :temperature_soil, :soil_surface_condition_2,
        :temperature_soil_min, :temperature_2cm_min, :precipitation_2, :precipitation_time_range_2, :observed_at)
    end
    
    def convert_synoptic_telegram(old_telegram, stations, errors)
      groups = old_telegram["Телеграмма"].tr('=', '').split(' ')
      new_telegram = SynopticObservation.new
      new_telegram.date = old_telegram["Дата"].tr('.', '-')
      new_telegram.observed_at = Time.parse(old_telegram["Дата"]+' UTC')
      new_telegram.term = old_telegram["Срок"].to_i
      new_telegram.telegram = old_telegram["Телеграмма"]
      if ((groups[0] == "ЩЭСМЮ" ) && (new_telegram.term % 2 == 0)) || ((groups[0] == "ЩЭСИД") && (new_telegram.term % 2 == 1))
      else 
        errors.push("Ошибка в различительной группе");
        return nil;
      end
      code_station = groups[1].to_i
      if stations[code_station].present?
        new_telegram.station_id = stations[code_station]
      else
        errors << "Ошибка в коде станции - <#{code_station}>"
        return nil
      end
      
      if (groups[2] =~ /^[134\/][1-4][0-9\/]([0-4][0-9]|50|5[6-9]|[6-9][0-9]|\/\/)$/).nil?
        errors << "Ошибка в группе 00"
        return nil
      end
      new_telegram.cloud_base_height = groups[2][2].to_i if groups[2][2] != '/'
      new_telegram.visibility_range = groups[2][3,2].to_i if groups[2][3] != '/'
      if (groups[3] =~ /^[0-9\/]([012][0-9]|3[0-6]|99|\/\/)([012][0-9]|30|\/\/)$/).nil?
        errors << "Ошибка в группе 0"
        return nil
      end
      new_telegram.cloud_amount_1 = groups[3][0].to_i if groups[3][0] != '/'
      new_telegram.wind_direction = groups[3][1,2].to_i if groups[3][1] != '/'
      new_telegram.wind_speed_avg = groups[3][3,2].to_i if groups[3][3] != '/'
      if (groups[4] =~ /^1[01][0-5][0-9][0-9]$/).nil?
        errors << "Ошибка в группе 1 раздела 1"
        return nil
      end
      sign = groups[4][1] == '0' ? '' : '-'
      val = sign+groups[4][2,2]+'.'+groups[4][4]
      new_telegram.temperature = val.to_f
      if (groups[5] =~ /^2[01][0-5][0-9][0-9]$/).nil?
        errors << "Ошибка в группе 2 раздела 1"
        return nil
      end
      sign = groups[5][1] == '0' ? '' : '-'
      val = sign+groups[5][2,2]+'.'+groups[5][4]
      new_telegram.temperature_dew_point = val.to_f
      pos333 = new_telegram.telegram =~ / 333 /
      pos555 = new_telegram.telegram =~ / 555 /
      len = pos333.present? ? pos333 : (pos555.present? ? pos555 : new_telegram.telegram.size-1)
      section = new_telegram.telegram[26,len-26]
      g_pos = section =~ / 3.... /
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^3\d{4}$/).present?
          first = group[1] == '0' ? '1' : '';
          val = first+group[1,3]+'.'+group[4];
          new_telegram.pressure_at_station_level = val.to_f
        else
          errors << "Ошибка в группе 3 раздела 1"
          return nil
        end
      end
      g_pos = section =~ / 4.... /
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^4\d{4}$/).present?
          first = group[1] == '0' ? '1' : ''
          val = first+group[1,3]+'.'+group[4]
          new_telegram.pressure_at_sea_level = val.to_f
        else
          errors << "Ошибка в группе 4 раздела 1"
          return nil
        end
      end
      g_pos = section =~ / 5.... /
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^5[0-8]\d{3}$/).present?
          new_telegram.pressure_tendency_characteristic = group[1].to_i
          new_telegram.pressure_tendency = (group[2,2]+'.'+group[4]).to_f
        else
          errors << "Ошибка в группе 5 раздела 1"
          return nil
        end
      end
      g_pos = section =~ / 6..../
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^6\d{3}[12]$/).present?
          new_telegram.precipitation_1 = group[1,3].to_i
          new_telegram.precipitation_time_range_1 = group[4].to_i
        else
          errors << "Ошибка в группе 6 раздела 1"
          return nil
        end
      end
      g_pos = section =~ / 7..../
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^7\d{4}$/).present?
          new_telegram.weather_in_term = group[1,2].to_i
          new_telegram.weather_past_1 = group[3].to_i
          new_telegram.weather_past_2 = group[4].to_i
        else
          errors << "Ошибка в группе 7 раздела 1"
          return nil
        end
      end
      g_pos = section =~ / 8..../
      if g_pos.present?
        group = section[g_pos+1,5]
        if (group =~ /^8[0-9\/]{4}$/).present?
          if group[1] != '/'
            new_telegram.cloud_amount_2 = group[1].to_i
            new_telegram.clouds_1 = group[2].to_i
            new_telegram.clouds_2 = group[3].to_i
            new_telegram.clouds_3 = group[4].to_i
          end
        else
          errors << "Ошибка в группе 8 раздела 1"
          return nil
        end
      end

      if pos333.present? #++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        # pos555 = new_telegram.telegram =~ / 555 /
        len = pos555.present? ? pos555 : new_telegram.telegram.size-1
        section = new_telegram.telegram[pos333+4,len-pos333-4]
        g_pos = section =~ / 1..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^1[01][0-9]{3}$/).present?
            sign = group[1] == '0' ? '' : '-'
            val = sign+group[2,2]+'.'+group[4]
            new_telegram.temperature_dey_max = val.to_f
          else
            errors << "Ошибка в группе 1 раздела 3"
            return nil
          end
        end
        g_pos = section =~ / 2..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^2[01][0-9]{3}$/).present?
            sign = group[1] == '0' ? '' : '-'
            val = sign+group[2,2]+'.'+group[4]
            new_telegram.temperature_night_min = val.to_f
          else
            errors << "Ошибка в группе 2 раздела 3"
            return nil
          end
        end
        g_pos = section =~ / 4..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^4[0-9\/][0-9]{3}$/).present?
            if group[1] != '/'
              new_telegram.underlying_surface_сondition = group[1].to_i
              new_telegram.snow_cover_height = group[2,3].to_i
            end
          else
            errors << "Ошибка в группе 4 раздела 3"
            return nil
          end
        end
        g_pos = section =~ / 55.../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^55[0-9]{3}$/).present?
            new_telegram.sunshine_duration = (group[2,2]+'.'+group[4]).to_f
          else
            errors << "Ошибка в группе 5 раздела 3"
            return nil
          end
        end
        g_pos = section =~ / 8..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^8[0-9\/]{2}([0-4][0-9]|50|5[6-9]|[6-9][0-9])$/).present?
            if group[1] != '/'
              new_telegram.cloud_amount_3 = group[1].to_i
              new_telegram.cloud_form = group[2].to_i
              new_telegram.cloud_height = group[3,2].to_i
            end
          else
            errors << "Ошибка в группе 8 раздела 3"
            return nil
          end
        end
        g_pos = section =~ / 9..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~/^9[0-9]{4}$/).present?
            new_telegram.weather_data_add = group[1,4].to_i
          else
            errors << "Ошибка в группе 9 раздела 3"
            return nil
          end
        end
      end

      if pos555.present? #+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
        len = new_telegram.telegram.size-1
        section = new_telegram.telegram[pos555+4,len-pos555-4]
        g_pos = section =~ / 1..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^1[0-9\/][01][0-9]{2}$/).present?
            if group[1] != '/'
              new_telegram.soil_surface_condition_1 = group[1].to_i
            end
            if group[2] != '/'
              sign = group[2] == '0' ? '' : '-';
              new_telegram.temperature_soil = (sign+group[3,2]).to_i
            end
          else
            errors << "Ошибка в группе 1 раздела 5"
            return nil
          end
        end
        g_pos = section =~ / 3..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^3[0-9\/][01][0-9]{2}$/).present?
            if group[1] != '/'
              new_telegram.soil_surface_condition_2 = group[1].to_i
            end
            if group[2] != '/'
              sign = group[2] == '0' ? '' : '-';
              new_telegram.temperature_soil_min = (sign+group[3]+'.'+group[4]).to_f
            end
          else
            errors << "Ошибка в группе 3 раздела 5"
            return nil
          end
        end
        g_pos = section =~ / 52.../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^52[01][0-9]{2}$/).present?
            sign = group[2] == '0' ? '' : '-';
            new_telegram.temperature_2cm_min = (sign+group[3,2]).to_i
          else
            errors << "Ошибка в группе 5 раздела 5"
            return nil
          end
        end
        g_pos = section =~ / 6..../
        if g_pos.present?
          group = section[g_pos+1,5]
          if (group =~ /^6[0-9\/]{4}$/).present?
            new_telegram.precipitation_2 = group[1,3].to_i
            new_telegram.precipitation_time_range_2 = group[4]
          else
            errors << "Ошибка в группе 6 раздела 5"
            return nil
          end
        end
      end

      new_telegram
    end
    
    def require_observer_or_technicist
      if current_user and ((current_user.role == 'observer') || (current_user.role == 'technicist'))
        return true
      else
        flash[:danger] = 'Вход только для наблюдателей'
        redirect_to login_path
        return false
      end
    end
    
    def fields_short_list(full_list)
      stations = Station.all.order(:id)
      full_list.map do |rec|
        {id: rec.id, date: rec.observed_at, term: rec.term, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
      end
    end
    
    def make_row_4_download(day, term, telegram)
      day+term+'1 '+telegram[6..-1].gsub(/ 333 /, " 33333 ").gsub(/ 555 /, " 55555 ")
    end
  
    def logged_user?
      if current_user.present?
        return true
      else
        flash[:danger] = 'Зарегистрируйтесь, пожалуйста'
        redirect_to login_path
        return false
      end
    end
end
