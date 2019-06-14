class RadiationObservationsController < ApplicationController
  before_action :find_radiation_observation, only: [:show, :destroy, :update_radiation_telegram]
  
  def show
    @actions = Audit.where("auditable_id = ? and auditable_type = 'RadiationObservation'", @radiation_observation.id)
  end
  
  def index
    @factor = params[:factor].present? ? params[:factor] : 'monthly'
    if @factor == 'daily'
      @radiation_observations = RadiationObservation.where('hour_observation = 0').paginate(page: params[:page]).order(:date_observation, :created_at).reverse_order
    else
      @radiation_observations = RadiationObservation.where('hour_observation > 0').paginate(page: params[:page]).order(:date_observation, :created_at).reverse_order
    end
  end
  
  def input_radiation_telegrams
    @stations = Station.all.order(:name)
    factor = params[:factor].present? ? params[:factor] : 'monthly'
    @telegram_type = (factor == 'daily' ? 'radiation_daily' : 'radiation')
    @telegrams = RadiationObservation.short_last_50_telegrams(current_user, factor)
  end
  
  def create_radiation_telegram
    date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00 UTC') : Time.now.utc
    # sql = "select * from radiation_observations where station_id = #{params[:radiation_observation][:station_id]} and hour_observation = #{params[:radiation_observation][:hour_observation]} and date_observation = '#{left_time}' order by telegram_date desc"
    # telegram = StormObservation.find_by_sql(sql).first
    telegram = RadiationObservation.find_by(station_id: params[:radiation_observation][:station_id], hour_observation: params[:radiation_observation][:hour_observation], date_observation: params[:radiation_observation][:date_observation])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    factor = params[:factor].present? ? params[:factor] : 'monthly'
    telegram_type = factor == 'monthly' ? 'radiation':'radiation_daily'
    if telegram.present?
      if telegram.update_attributes radiation_observation_params
        last_telegrams = RadiationObservation.short_last_50_telegrams(current_user,factor)
        render json: {telegrams: last_telegrams, 
                      tlgType: telegram_type, 
                      inputMode: params[:input_mode],
                      currDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = RadiationObservation.new(radiation_observation_params)
      # telegram.telegram_date = date_dev 
      if telegram.save
        new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.station.name, telegram: telegram.telegram}
        ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: telegram_type
        last_telegrams = RadiationObservation.short_last_50_telegrams(current_user, factor)
        render json: {telegrams: last_telegrams, 
                      tlgType: telegram_type, 
                      inputMode: params[:input_mode],
                      currDate: date_dev, #telegram.telegram_date, 
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def get_last_telegrams
    factor = params[:factor].present? ? params[:factor] : 'monthly'
    telegrams = RadiationObservation.short_last_50_telegrams(current_user, factor)
    render json: {telegrams: telegrams, tlgType: (factor == 'daily' ? 'radiation_daily':'radiation'), codeStation: current_user.code_station}
  end
  
  def update_radiation_telegram
    if @radiation_observation.update_attributes radiation_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  def destroy
    factor = @radiation_observation.hour_observation == 0 ? 'daily' : 'monthly'
    @radiation_observation.destroy
    flash[:success] = "Телеграмма удалена"
    redirect_to '/radiation_observations?factor='+factor
  end
  
  
  private
    def find_radiation_observation
      @radiation_observation = RadiationObservation.find(params[:id])
    end
    
    def radiation_observation_params
      params.require(:radiation_observation).permit(:telegram, :station_id, :hour_observation, :date_observation)
    end
end
