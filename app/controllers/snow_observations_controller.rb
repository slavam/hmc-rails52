class SnowObservationsController < ApplicationController
  before_action :find_snow_observation, only: [:show, :destroy, :update_snow_telegram]

  def index
    @snow_observations = SnowObservation.paginate(page: params[:page]).order(:date_observation, :created_at).reverse_order
  end
  
  def show
  end
  
  def input_snow_telegrams
    @snow_points = SnowPoint.actual
    @telegrams = SnowObservation.short_last_50_telegrams(current_user)
    @input_mode = params[:input_mode]
  end
  
  def create_snow_telegram
    date_dev = params[:date]
    telegram = SnowObservation.find_by(snow_type: params[:snow_observation][:snow_type], 
        snow_point_id: params[:snow_observation][:snow_point_id], 
        date_observation: params[:snow_observation][:date_observation])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if telegram.present?
      if telegram.update snow_observation_params
        last_telegrams = SnowObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'snow', 
                      inputMode: params[:input_mode],
                      observationDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = SnowObservation.new(snow_observation_params)
      if telegram.save
        # new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.snow_point.name, telegram: telegram.telegram}
        # ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'snow'
        last_telegrams = SnowObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'snow',
                      inputMode: params[:input_mode],
                      observationDate: date_dev,
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def update_snow_telegram
    if @snow_observation.update snow_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  def get_last_telegrams
    telegrams = SnowObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'snow'}
  end
  
  private
    def find_snow_observation
      @snow_observation = SnowObservation.find(params[:id])
    end
    
    def snow_observation_params
      params.require(:snow_observation).permit(:snow_type, :snow_point_id, :day_obs, :month_obs, :last_digit_year_obs, :date_observation, :telegram)
    end
end
