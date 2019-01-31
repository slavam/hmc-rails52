class HydroObservationsController < ApplicationController
  before_action :find_hydro_observation, only: [:show, :destroy, :update_hydro_telegram]

  def index
    @hydro_observations = HydroObservation.paginate(page: params[:page]).order(:date_observation, :created_at).reverse_order
  end
  
  def show
  end
  
  def input_hydro_telegrams
    @hydro_posts = HydroPost.all.order(:id)
    @telegrams = HydroObservation.short_last_50_telegrams(current_user)
    @input_mode = params[:input_mode]
  end
  
  def create_hydro_telegram
    # date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00') : Time.now # local date not UTC
    date_dev = params[:date]
    telegram = HydroObservation.find_by(hydro_type: params[:hydro_observation][:hydro_type], 
        hydro_post_id: params[:hydro_observation][:hydro_post_id], 
        hour_obs: params[:hydro_observation][:hour_obs], 
        date_observation: params[:hydro_observation][:date_observation],
        content_factor: params[:hydro_observation][:content_factor])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if telegram.present?
      if telegram.update_attributes hydro_observation_params
        last_telegrams = HydroObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'hydro', 
                      inputMode: params[:input_mode],
                      observationDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = HydroObservation.new(hydro_observation_params)
      if telegram.save
        # new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.hydro_post.town, telegram: telegram.telegram}
        # ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'hydro'
        last_telegrams = HydroObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'hydro', 
                      inputMode: params[:input_mode],
                      observationDate: date_dev, 
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def update_hydro_telegram
    if @hydro_observation.update_attributes hydro_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  def get_last_telegrams
    telegrams = HydroObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'hydro'}
  end
  
  private
    def find_hydro_observation
      @hydro_observation = HydroObservation.find(params[:id])
    end
    
    def hydro_observation_params
      params.require(:hydro_observation).permit(:hydro_type, :hydro_post_id, :day_obs, :hour_obs, :date_observation, :content_factor, :telegram)
    end
end
