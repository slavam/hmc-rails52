class OtherObservationsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:create_other_data]
  def index
    @factor = params[:factor]
    if @factor == 'wind'
      @other_observations = OtherObservation.where('data_type = ?', @factor).paginate(page: params[:page]).order(:obs_date, :period).reverse_order
    else
      @other_observations = OtherObservation.where('data_type = ?', @factor).paginate(page: params[:page]).order(:obs_date, :id).reverse_order
    end
  end

  def input_other_telegrams
    @stations =  Station.name_stations_as_array #all.order(:name)
    @observations = OtherObservation.last_50_telegrams('temp') #.to_json
    @input_mode = params[:input_mode]
    @local_time = Time.now.localtime.strftime("%Y-%m-%d %H")
    @station_id = current_user.station_id.to_s
  end

  def get_last_telegrams
    observations = OtherObservation.last_50_telegrams(params[:data_type])
    render json: {observations: observations}
  end

  def wind_daily_data
    @observation_date = params[:obs_date].present? ? params[:obs_date] : '1991-01-01'
    @station_id = params[:station_id].present? ? params[:station_id].to_i : 1
    observation = OtherObservation.find_by(data_type: 'windd', station_id: @station_id, obs_date: @observation_date)
    if observation.present?
      @wind = observation.description.split(';')
    else
      @wind = Array.new(8)
    end
    respond_to do |format|
      format.html
      format.json do
        render json: {wind: @wind}
      end
    end
  end

  def wind_monthly_data
    @year = params[:year].present? ? params[:year].to_i : 1991
    @month = params[:month].present? ? params[:month].to_i : 1
    @station_id = params[:station_id].present? ? params[:station_id] : 1
    last_day = Time.days_in_month(@month, @year)
    start_date = "#{@year}-#{@month}-1"
    stop_date = "#{@year}-#{@month}-#{last_day}"
    @monthly_data = [] 
    recs = OtherObservation.select(:description).where('data_type = "windd" AND station_id = ? AND obs_date BETWEEN ? AND ?', @station_id, start_date, stop_date).order(:obs_date)
    if recs.size > 0
      recs.each{|r| r.description == ';;;;;;;' ? @monthly_data << Array.new(8) : @monthly_data << r.description.split(';')}
      # recs.each{|w| @monthly_data << w.description.split(';')}
    else
      last_day.times {|i| @monthly_data[i] = Array.new(8)}
    end
    puts "++++++++++++++++++++++++++++++++++++"
    puts @monthly_data.inspect
    respond_to do |format|
      format.html
      # format.pdf do
      #   pdf = Precipitation.new(@precipitation, @year, @month)
      #   send_data pdf.render, filename: "percipitation_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4" #, :page_layout => :landscape
      # end
      format.json do
        render json: {wind: @monthly_data}
      end
    end
  end

  def create_wind_data
    wind = params[:wind]
    puts "+++++++++++++++++++"
    puts wind.inspect
    year = params[:year].to_i
    month = params[:month].to_i
    station_id = params[:station_id]
    last_day = Time.days_in_month(month, year)
    updated = 0
    created = 0
    last_day.times do |i|
      obs_date = "#{year}-#{month}-#{i+1}"
      observation = OtherObservation.find_by(data_type: 'windd', station_id: station_id, obs_date: obs_date)
      if observation.present? 
        observation.description = wind[i.to_s].present? ? wind[i.to_s].join(';') : ";;;;;;;;"
        observation.save
        updated += 1
      else
        observation = OtherObservation.new(
          data_type: 'windd', 
          station_id: station_id, 
          obs_date: obs_date,
          description: wind[i].join(';')
        )
        observation.save
        created += 1
      end
    end
    if (created+updated) == last_day
      render json: {message: "За #{month}-#{year} обновлено #{updated} и создано #{created}"}, status: :ok
    else
      render json: {errors: observation.errors.messages}, status: :unprocessable_entity
    end
  end

  def create_other_data
    data_type = params[:other_observation][:data_type]
    if data_type == 'perc'
      observation = OtherObservation.find_by(data_type: params[:other_observation][:data_type],
          source: params[:other_observation][:source],
          period: params[:other_observation][:period],
          obs_date: params[:other_observation][:obs_date])
    elsif data_type == 'wind'
      observation = OtherObservation.find_by(data_type: params[:other_observation][:data_type],
        station_id: params[:other_observation][:station_id],
        period: params[:other_observation][:period],
        obs_date: params[:other_observation][:obs_date])
    else
      observation = OtherObservation.find_by(data_type: params[:other_observation][:data_type],
          station_id: params[:other_observation][:station_id],
          obs_date: params[:other_observation][:obs_date])
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if observation.present?
      if observation.update other_observation_params
        last_telegrams = OtherObservation.last_50_telegrams(params[:other_observation][:data_type])
        render json: {observations: last_telegrams,
                      errors: ["Данные изменены"]}, status: :ok
      else
        render json: {errors: observation.errors.messages}, status: :unprocessable_entity
      end
    else
      observation = OtherObservation.new(other_observation_params)
      if observation.save
        # new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.snow_point.name, telegram: telegram.telegram}
        # ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'snow'
        last_telegrams = OtherObservation.last_50_telegrams(params[:other_observation][:data_type])
        render json: {observations: last_telegrams,
                      # tlgType: 'snow',
                      # inputMode: params[:input_mode],
                      # observationDate: date_dev,
                      errors: ["Данные сохранены"]}
      else
        # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{observation.errors.messages.inspect}")
        render json: {errors: observation.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def delete_other_data
    observation = OtherObservation.find(params[:id])
    data_type = observation.data_type
    if observation.destroy
      # ActionCable.server.broadcast "candidate_channel", applicant: @applicant, action: 'delete'
      last_telegrams = OtherObservation.last_50_telegrams(data_type)
      render json: {observations: last_telegrams, errors: ["Запись удалена"]}
    else
      render json: {errors: observation.errors.messages}, status: :unprocessable_entity
    end
  end

  def total_monthly_precipitation
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    last_day = Time.days_in_month(@month.to_i, @year.to_i)
    precipitation_posts = get_month_precipitation(@year, @month)
    precipitation_stations = get_month_precipitation_stations(@year, @month)
    @precipitation = []
    @precipitation = precipitation_fill(precipitation_posts, precipitation_stations, last_day)
    respond_to do |format|
      format.html
      format.pdf do
        pdf = Precipitation.new(@precipitation, @year, @month)
        send_data pdf.render, filename: "percipitation_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4" #, :page_layout => :landscape
      end
      format.json do
        render json: {precipitation: @precipitation}
      end
    end
  end

  def get_month_precipitation_stations(year, month)
    start_date = year+'-'+month+'-01'
    last_day = Time.days_in_month(month.to_i, year.to_i).to_s
    end_date = year+'-'+month+'-'+last_day
    rows = SynopticObservation.select("date, station_id, term, precipitation_1").
      where("date >= ? AND date <= ? AND station_id IN (1,2,3,10) AND term IN (6,18) AND precipitation_1 > 0", start_date, end_date).order(:date, :station_id, :term)
      num_row = [nil,1,7,6,nil,nil,nil,nil,nil,nil,15]
    ret = []
    rows.each do |p|
      i = num_row[p.station_id]
      j = p.date.day
      ret[i] ||= []
      ret[i][j] ||= [nil, nil,'','']
      if p.term == 6
        ret[i][j][0] = p.precipitation
      else
        ret[i][j][1] = p.precipitation
      end
    end
    ret
  end

  def precipitation_fill(posts_data, stations_data, last_day)
  #   ['Авдотьино', 'Кировский', 'Макеевка', 'Старобешево', 'Тельманово', 
  #     'Раздольное', 'Стрюково', 'Дмитровка', 'Новоселовка', 'Благодатное', 'Алексеево-Орловка']
    post_num_row = [3,2,4,12,14,13,9,10,5,8,11]
    (1..last_day.to_i).each{|i|
      (0..10).each{|j|
      if posts_data[i].present? and posts_data[i][j].present?
        stations_data[post_num_row[j]] ||= []
        stations_data[post_num_row[j]][i] ||= [nil, nil,'','']
        stations_data[post_num_row[j]][i] = posts_data[i][j]
      end
      }
    }
    stations_data
  end

  def monthly_precipitation
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    @precipitation = get_month_precipitation(@year, @month)
    respond_to do |format|
      format.html
      format.json do
        render json: {precipitation: @precipitation}
      end
    end
  end

  def get_month_precipitation(year, month)
    posts = OtherObservation::POSTS
    last_day = Time.days_in_month(month.to_i, year.to_i).to_s
    start_date = year+'-'+month+'-01'
    end_date = year+'-'+month+'-'+last_day
    rows = OtherObservation.select("obs_date, source, period, value, description").
      where("obs_date >= ? AND obs_date <= ? AND data_type='perc'", start_date, end_date).order(:obs_date, :source, :period)
    precipitation = []
    rows.each {|p|
      d = p.obs_date.day
      s = posts.index(p.source)
      precipitation[d] ||= []
      precipitation[d][s] ||= [nil,nil,'','']

      if p.period == 'night'
        precipitation[d][s][0] = p.value
        precipitation[d][s][2] = p.description if p.description.present? and p.description > ''
      else
        precipitation[d][s][1] = p.value
        precipitation[d][s][3] = p.description if p.description.present? and p.description > ''
      end
    }
    precipitation
  end

  def temperatures_8_16
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    last_day = Time.days_in_month(@month.to_i, @year.to_i).to_s.rjust(2, '0')
    start_date = @year+'-'+@month+'-01'
    end_date = @year+'-'+@month+'-'+last_day
    rows = OtherObservation.select("obs_date, station_id, data_type, value").
      where("station_id in (1,2,3,10) and obs_date >= ? AND obs_date <= ? AND data_type in ('temp', 'temp16')", start_date, end_date).order(:obs_date, :station_id)
    @temperatures = []
    rows.each {|t|
      d = t.obs_date.day
      s = t.station_id
      @temperatures[d] ||= []
      @temperatures[d][s] ||= []
      @temperatures[d][5] ||= []
      @temperatures[d][6] ||= []
      @temperatures[d][7] ||= []
      if t.data_type == 'temp'
        @temperatures[d][s][0] = t.value
      else
        @temperatures[d][s][1] = t.value
      end
    }
    (1..last_day.to_i).each{|i|
      @temperatures[i] ||= []
      if @temperatures[i].present? && @temperatures[i][1].present? && @temperatures[i][1][0].present?
        if @temperatures[i][3].present? && @temperatures[i][3][0].present?
          @temperatures[i][5][0] = ((@temperatures[i][1][0]+@temperatures[i][3][0])/2).round(1) # Gorlovka
        end
        if @temperatures[i][2].present? && @temperatures[i][2][0].present?
          @temperatures[i][7][0] = ((@temperatures[i][1][0]+@temperatures[i][2][0])/2).round(1) # Starobeshevo
        end
      end
      if @temperatures[i].present? && @temperatures[i][2].present? && @temperatures[i][2][0].present?
        if @temperatures[i][3].present? && @temperatures[i][3][0].present?
          @temperatures[i][6][0] = ((@temperatures[i][2][0]+@temperatures[i][3][0])/2).round(1) # Shahtersk
        end
      end
      # 16
      if @temperatures[i].present? && @temperatures[i][1].present? && @temperatures[i][1][1].present?
        if @temperatures[i][3].present? && @temperatures[i][3][1].present?
          @temperatures[i][5][1] = ((@temperatures[i][1][1]+@temperatures[i][3][1])/2).round(1) # Gorlovka
        end
        if @temperatures[i][2].present? && @temperatures[i][2][1].present?
          @temperatures[i][7][1] = ((@temperatures[i][1][1]+@temperatures[i][2][1])/2).round(1) # Starobeshevo
        end
      end
      if @temperatures[i].present? && @temperatures[i][2].present? && @temperatures[i][2][1].present?
        if @temperatures[i][3].present? && @temperatures[i][3][1].present?
          @temperatures[i][6][1] = ((@temperatures[i][2][1]+@temperatures[i][3][1])/2).round(1) # Shahtersk
        end
      end
    }
    respond_to do |format|
      format.html
      format.pdf do
        pdf = Temp816.new(@temperatures, @year, @month, params[:variant])
        send_data pdf.render, filename: "energy2_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
      format.json do
        render json: {temperatures: @temperatures}
      end
    end
  end

  def monthly_temperatures
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    @variant = params[:variant].present? ? params[:variant] : 'temp'
    @temperatures = get_month_temperatures(@year, @month, @variant)
    respond_to do |format|
      format.html
      format.json do
        render json: {temperatures: @temperatures}
      end
    end
  end

  def get_month_temperatures(year, month, variant)
    last_day = Time.days_in_month(month.to_i, year.to_i).to_s.rjust(2, '0')
    start_date = year+'-'+month+'-01'
    end_date = year+'-'+month+'-'+last_day
    rows = OtherObservation.select("obs_date, station_id, value").
      where("station_id in (1,2,3,10) and obs_date >= ? AND obs_date <= ? AND data_type='#{variant}'", start_date, end_date).order(:obs_date, :station_id)
    result = []
    rows.each {|t|
      d = t.obs_date.day
      s = t.station_id == 10 ? 4 : t.station_id
      result[d] ||= []
      result[d][s] = t.value
    }
    result
  end

  def winds
    @calc_date = params[:calc_date].present? ? params[:calc_date] : Time.now.strftime("%Y-%m-%d")
    rows = OtherObservation.select("station_id, value, period").
      where("station_id in (1,2,3,10) and obs_date = ? AND data_type='wind'", @calc_date).order(:period, :station_id)
    @winds = []
    rows.each {|o_o|
      t = o_o.period.to_i
      # s = o_o.station_id == 10 ? 4 : o_o.station_id
      s = o_o.station_id
      @winds[s] ||= []
      @winds[s][t] = o_o.value
    }
    respond_to do |format|
      format.html
      format.json do
        render json: {winds: @winds}
      end
    end
  end

  private
    def other_observation_params
      params.require(:other_observation).permit(:data_type, :value, :obs_date, :station_id, :source, :description, :period)
    end
end
