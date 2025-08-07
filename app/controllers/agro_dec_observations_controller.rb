class AgroDecObservationsController < ApplicationController
  include AgroObservationsHelper
  before_action :find_agro_dec_observation, only: [:show, :update_agro_dec_telegram, :destroy]
  
  def destroy
    @agro_dec_observation.destroy
    flash[:success] = "Удалена декадная агротелеграмма"
    redirect_to agro_dec_observations_path
  end

  def index
    @agro_dec_observations = AgroDecObservation.paginate(page: params[:page]).order(:date_dev, :created_at).reverse_order
  end
  
  def show
    @actions = Audit.where("auditable_id = ? and auditable_type = 'AgroDecObservation'", @agro_dec_observation.id)
  end
  
  def agro_meteo_data_warm
  end
  
  def agro_meteo_data
    @period = params[:period]
    @year = params[:year].present? ? params[:year] : Time.now.year
    @month = params[:month].present? ? params[:month] : Time.now.month
    @decade = params[:decade].present? ? params[:decade].to_i : 1
    case @decade
      when 1
        dec = '= 10 '
      when 2
        dec = ' = 20 '
      when 3
        dec = ' > 20 '
    end
    @stations = []
    Station.all.order(:id).each {|s| @stations[s.id] = s.name}
    
    observations = AgroDecObservation.where("station_id in (1,2,3,4,5) and telegram_num=1 and date_dev like '#{@year}%' and month_obs = ? and day_obs #{dec}", @month.to_i).order(:station_id)
    telegrams = observations.as_json
    # Rails.logger.debug("My object>>>>>>>>>>>>>>> #{telegrams.inspect}") 
    @telegrams = []
    telegrams.each do |t|
      t['precipitation_dec'] = precipitation_to_s(t['precipitation_dec'])
      t['percipitation_dec_max'] = precipitation_to_s(t['percipitation_dec_max'])
      if @period == 'cold'
        crop_dec_condition = CropDecCondition.find_by_sql("select max(height_snow_cover) height_snow_cover, max(snow_cover) snow_cover, max(snow_cover_density) snow_cover_density, max(number_measurements_0) number_measurements_0, max(number_measurements_3) number_measurements_3, max(number_measurements_30) number_measurements_30, max(ice_crust) ice_crust, max(thickness_ice_cake) thickness_ice_cake, max(depth_thawing_soil_2) depth_thawing_soil_2, max(depth_soil_freezing) depth_soil_freezing, min(thermometer_index) thermometer_index, min(temperature_dec_min_soil3) temperature_dec_min_soil3, max(height_snow_cover_rail) height_snow_cover_rail from crop_dec_conditions where agro_dec_observation_id = #{t["id"]} ;")[0]
        t["height_snow_cover"] = crop_dec_condition.height_snow_cover
        t["snow_cover"] = crop_dec_condition.snow_cover_to_s # if crop_dec_condition.snow_cover.present?
        t["snow_cover_density"] = crop_dec_condition.snow_cover_density
        t["number_measurements_0"] = crop_dec_condition.number_measurements_0
        t["number_measurements_3"] = crop_dec_condition.number_measurements_3
        t["number_measurements_30"] = crop_dec_condition.number_measurements_30
        t["ice_crust"] = crop_dec_condition.ice_crust
        t["thickness_ice_cake"] = crop_dec_condition.thickness_ice_cake
        t["depth_thawing_soil_2"] = crop_dec_condition.depth_thawing_soil_2
        t["depth_soil_freezing"] = crop_dec_condition.depth_soil_freezing
        t["thermometer_index"] = crop_dec_condition.thermometer # if crop_dec_condition.thermometer_index.present?
        t["temperature_dec_min_soil3"] = crop_dec_condition.temperature_dec_min_soil3
        t["height_snow_cover_rail"] = crop_dec_condition.height_snow_cover_rail
      else
        if t['telegram'].match(/ 111 90.+ 7.... .+91/)
          index_g7 = t['telegram'].index(' 7')
          t['percipitation_dec_max'] = t['telegram'][index_g7+2,3].to_i
          t['percipitation5_dec_day_num'] = t['telegram'][index_g7+5]
        end
        if t['freezing_dec_day_num'] == 0
          if @decade == 3
            fd = (@year.to_s+'-'+@month.to_s+'-1').to_date
            t['freezing_dec_day_num'] = fd.end_of_month.day == 30 ? '10':'11'
          else
            t['freezing_dec_day_num'] = '10'
          end
        end
      end
      @telegrams << t
    end
# Rails.logger.debug("My object>>>>>>>>>>>>>>> #{@telegrams.inspect}") 
    @temperature_avg_month = []
    @precipitation_month = []
    if (@decade == 3) and (@period == 'warm')
      # ! в телеграмме за первое число содержится средняя температура за предыдущие сутки, т.е. за последний день предыдущего месяца
      # sql = " SELECT station_id, avg(temperature_avg_24) temperature_avg_24 
      #         FROM agro_observations 
      #         WHERE station_id not in (6, 9) AND date_dev like '#{@year}%' AND  month_obs=#{@month} AND telegram_num=1
              # GROUP BY station_id;"
      start = @year.to_s+'-'+@month.to_s+'-2%'
      finish = ((@year.to_s+'-'+@month.to_s+'-2').to_date+1.month).strftime("%Y-%m-%d")
      sql = " SELECT station_id, avg(temperature_avg_24) temperature_avg_24 
              FROM agro_observations 
              WHERE station_id not in (6, 9) AND telegram_num=1
              AND date_dev > '#{start}' AND date_dev < '#{finish}'
              GROUP BY station_id;"
      AgroObservation.find_by_sql(sql).each {|t| @temperature_avg_month[t.station_id] = t.temperature_avg_24}
      
      sql = " SELECT station_id, sum(precipitation_dec) precipitation_dec 
              FROM agro_dec_observations 
              WHERE station_id not in (6, 9) AND date_dev like '#{@year}%' AND  month_obs=#{@month} AND telegram_num=1 AND precipitation_dec < 990 group by station_id;"
      AgroDecObservation.find_by_sql(sql).each {|p| @precipitation_month[p.station_id] = p.precipitation_dec}
    end

    
    respond_to do |format|
      format.html 
      format.json { render json: {telegrams: @telegrams, temperatureMonth: @temperature_avg_month, precipitationMonth: @precipitation_month} }
      format.pdf do
        pdf = AgroDecMeteoData.new(@year, @month, @decade, @stations, @telegrams, @period, @temperature_avg_month, @precipitation_month)
        send_data pdf.render, filename: "agro_dec_meteo_data_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true
      end
    end
  end
  
  def search_agro_dec_telegrams
    @date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    @date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
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
    
       
    sql = "select * from agro_dec_observations where date_dev >= '#{@date_from}' and date_dev <= '#{@date_to} 23:59:59' #{station} #{and_text} order by date_dev desc;"
    tlgs = AgroDecObservation.find_by_sql(sql)
    @stations = Station.stations_array_with_any
    @telegrams = agro_fields_short_list(tlgs)
    respond_to do |format|
      format.html 
      format.json { render json: {telegrams: @telegrams} }
    end
  end
  
  def agro_fields_short_list(full_list)
    stations = Station.all.order(:id)
    full_list.map do |rec|
      {id: rec.id, date: rec.date_dev, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end
  
  def create_agro_dec_telegram
    telegram_text = params[:agro_dec_observation][:telegram]
    station_id = params[:agro_dec_observation][:station_id]
    date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00 UTC') : Time.now
    day_obs = telegram_text[12,2].to_i
    month_obs = telegram_text[14,2].to_i
    telegram_num = telegram_text[16,1].to_i
    yyyy_mm = date_dev.year.to_s + '-' + date_dev.month.to_s.rjust(2, '0') + '%'

    telegram = AgroDecObservation.where("station_id = ? and day_obs = ? and month_obs = ? and telegram_num = ? and date_dev like ?", station_id, day_obs, month_obs, telegram_num, yyyy_mm).order(:date_dev).reverse_order.first
    if telegram.present? 
      if telegram.update agro_dec_observation_params
        params[:crop_dec_conditions].each do |k, v|
          c_c = CropDecCondition.find_by(agro_dec_observation_id: telegram.id, crop_code: v[:crop_code].to_i)
          if c_c.present?
            c_c.update crop_dec_conditions_params(v)
          else
            telegram.crop_dec_conditions.build(crop_dec_conditions_params(v)).save
          end
        end if params[:crop_dec_conditions].present?
        last_telegrams = AgroDecObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'agro_dec', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = AgroDecObservation.new(agro_dec_observation_params)
      telegram.date_dev = date_dev
      telegram.day_obs = day_obs
      telegram.month_obs = month_obs
      telegram.telegram_num = telegram_num
      telegram.telegram = telegram_text
      if telegram.save
        params[:crop_dec_conditions].each do |k, v|
          telegram.crop_dec_conditions.build(crop_dec_conditions_params(v)).save
        end if params[:crop_dec_conditions].present?
        new_telegram = {id: telegram.id, date: telegram.date_dev, station_name: telegram.station.name, telegram: telegram.telegram}
        ActionCable.server.broadcast("synoptic_telegram_channel", {telegram: new_telegram, tlgType: 'agro_dec'})
        last_telegrams = AgroDecObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'agro_dec', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, 
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def create_agro_dec_rf
    # telegram_text = params[:agro_dec_observation][:telegram]
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>state_crops: #{params[:crop_dec_conditions].inspect}") 
    station_id = params[:agro_dec_observation][:station_id].to_i
    date_dev = params[:agro_dec_observation][:date_dev]
    telegram_num = params[:agro_dec_observation][:telegram_num].to_i
    telegram = AgroDecObservation.find_by("station_id = ? and telegram_num = ? and date_dev = ?", station_id, telegram_num, date_dev)
    if telegram.present? 
      if telegram.update agro_dec_observation_params
        params[:agro_dec_observation][:crop_dec_conditions].each do |k, v|
          c_c = CropDecCondition.find_by(agro_dec_observation_id: telegram.id, crop_code: v[:crop_code].to_i)
          if c_c.present?
            c_c.update crop_dec_conditions_params(v)
          else
            telegram.crop_dec_conditions.build(crop_dec_conditions_params(v)).save
          end
        end if params[:agro_dec_observation][:crop_dec_conditions].present?
        last_telegrams = last_20_telegrams_rf #AgroDecObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = AgroDecObservation.new(agro_dec_observation_params)
      if telegram.save
        params[:agro_dec_observation][:crop_dec_conditions].each do |k, v|
          telegram.crop_dec_conditions.build(crop_dec_conditions_params(v)).save
        end if params[:agro_dec_observation][:crop_dec_conditions].present?
        # new_telegram = {id: telegram.id, date: telegram.date_dev, station_name: telegram.station.name, telegram: telegram.telegram}
        # new_telegram = {id: telegram.id, date_dev: telegram.date_dev, station_id: telegram.station_id, telegram: telegram.telegram, created_at: telegram.created_at}
        # ActionCable.server.broadcast("synoptic_telegram_channel", {telegram: new_telegram, tlgType: 'agro_dec'})
        last_telegrams = last_20_telegrams_rf #AgroDecObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      errors: ["Телеграмма сохранена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def last_20_telegrams_rf
    all_fields = AgroDecObservation.all.limit(20).order(:date_dev, :updated_at).reverse_order
    telegrams = all_fields.each{|t| {id: t.id, date_dev: t.date_dev, station_id: t.station_id, telegram: t.telegram, created_at: t.created_at}}
  end

  def input_agro_dec_rf
    stations = Station.all.order(:name)
    @stations = stations.map {|s| {label: s.name, value: s.code, id: s.id}}
    @telegrams = last_20_telegrams_rf
    cd = Time.now
    c_day = cd.day
    if c_day<10
      @report_date = (cd-c_day.days).strftime("%Y-%m-%d")
    elsif c_day<20
      @report_date = cd.strftime("%Y-%m-10")
    else
      @report_date = cd.strftime("%Y-%m-20")
    end
    @current_station_id = (current_user && current_user.station_id)? current_user.station_id : 0
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{@report_date.inspect}") 
  end

  def input_agro_dec_telegrams
    @stations = Station.all.order(:name)
    @telegrams = AgroDecObservation.short_last_50_telegrams(current_user)
  end
  
  def get_last_telegrams
    telegrams = AgroDecObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'agro_dec'}
  end
  
  def update_agro_dec_telegram
# Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{params[:agro_observation][:telegram].inspect}") 
    if @agro_dec_observation.update agro_dec_observation_params
      params[:crop_dec_conditions].each do |k, v|
        c_c = CropDecCondition.find_by(agro_dec_observation_id: @agro_dec_observation.id, crop_code: v[:crop_code].to_i)
        if c_c.present?
          c_c.update crop_dec_conditions_params(v)
        else
          @agro_observation.crop_dec_conditions.build(crop_dec_conditions_params(v)).save
        end
      end if params[:crop_dec_conditions].present?
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  private
    def find_agro_dec_observation
      @agro_dec_observation = AgroDecObservation.find(params[:id])
    end
    
    def crop_dec_conditions_params(crop_dec_condition)
      crop_dec_condition.permit(:agro_dec_observation_id, :crop_code, :plot_code, :agrotechnology, :development_phase_1, 
        :development_phase_2, :development_phase_3, :development_phase_4, :development_phase_5, :day_phase_1, :day_phase_2, 
        :day_phase_3, :day_phase_4, :day_phase_5, :assessment_condition_1, :assessment_condition_2, :assessment_condition_3, 
        :assessment_condition_4, :assessment_condition_5, :clogging_weeds, :height_plants, :number_plants, :average_mass, 
        :agricultural_work_1, :agricultural_work_2, :agricultural_work_3, :agricultural_work_4, :agricultural_work_5, 
        :day_work_1, :day_work_2, :day_work_3, :day_work_4, :day_work_5, :damage_plants_1, :damage_plants_2, :damage_plants_3, 
        :damage_plants_4, :damage_plants_5, :day_damage_1, :day_damage_2, :day_damage_3, :day_damage_4, :day_damage_5, 
        :damage_level_1, :damage_level_2, :damage_level_3, :damage_level_4, :damage_level_5, :damage_volume_1, :damage_volume_2, 
        :damage_volume_3, :damage_volume_4, :damage_volume_5, :damage_space_1, :damage_space_2, :damage_space_3, :damage_space_4, 
        :damage_space_5, :number_spicas, :num_bad_spicas, :number_stalks, :stalk_with_spike_num, :normal_size_potato, :losses, 
        :grain_num, :bad_grain_percent, :bushiness, :shoots_inflorescences, :grain1000_mass, :moisture_reserve_10, :moisture_reserve_5, 
        :soil_index, :moisture_reserve_2, :moisture_reserve_1, :temperature_water_2, :depth_water, :depth_groundwater, 
        :depth_thawing_soil, :depth_soil_wetting, :height_snow_cover, :snow_retention, :snow_cover, :snow_cover_density, 
        :number_measurements_0, :number_measurements_3, :number_measurements_30, :ice_crust, :thickness_ice_cake, :depth_thawing_soil_2, 
        :depth_soil_freezing, :thaw_days, :thermometer_index, :temperature_dec_min_soil3, :height_snow_cover_rail, :viable_method, 
        :soil_index_2, :losses_1, :losses_2, :losses_3, :losses_4, :temperature_dead50)
    end

    def agro_dec_observation_params
      params.require(:agro_dec_observation).permit(:date_dev, :day_obs, :month_obs, :telegram, :station_id, :telegram_num, 
        :temperature_dec_avg_delta, :temperature_dec_avg, :temperature_dec_max, :hot_dec_day_num, :temperature_dec_min, 
        :dry_dec_day_num, :temperature_dec_min_soil, :cold_soil_dec_day_num, :precipitation_dec, :wet_dec_day_num, 
        :precipitation_dec_percent, :wind_speed_dec_max, :wind_speed_dec_max_day_num, :duster_dec_day_num, :temperature_dec_max_soil, 
        :sunshine_duration_dec, :freezing_dec_day_num, :temperature_dec_avg_soil10, :temperature25_soil10_dec_day_num, :dew_dec_day_num, 
        :saturation_deficit_dec_avg, :relative_humidity_dec_avg, :percipitation_dec_max, :percipitation5_dec_day_num)
    end
end
