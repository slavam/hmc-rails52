class SeaObservationsController < ApplicationController
  before_action :find_sea_observation, only: [:show, :destroy, :update_sea_telegram]
  
  def show
    # date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    # date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    # station = params[:station_id].present? ? "&station_id=#{params[:station_id]}" : ''
    # text = params[:text].present? ? "&text=#{params[:text]}" : ''
    # @search_link = "/radiation_observations/search_radiation_telegrams?telegram_type=radiation&date_from=#{date_from}&date_to=#{date_to}#{station}#{text}"
    @actions = Audit.where("auditable_id = ? and auditable_type = 'SeaObservation'", @sea_observation.id)
  end
  
  def index
    @sea_observations = SeaObservation.paginate(page: params[:page]).order(:date_observation, :created_at).reverse_order
  end
  
  def input_sea_telegrams
    @stations = Station.all.order(:name)
    @telegrams = SeaObservation.short_last_50_telegrams(current_user)
  end
  
  def create_sea_telegram
    date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00 UTC') : Time.now.utc
    # sql = "select * from radiation_observations where station_id = #{params[:radiation_observation][:station_id]} and hour_observation = #{params[:radiation_observation][:hour_observation]} and date_observation = '#{left_time}' order by telegram_date desc"
    # telegram = StormObservation.find_by_sql(sql).first
    telegram = SeaObservation.find_by(station_id: params[:sea_observation][:station_id], hour_observation: params[:sea_observation][:hour_observation], date_observation: params[:sea_observation][:date_observation])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if telegram.present?
      if telegram.update_attributes sea_observation_params
        last_telegrams = SeaObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'sea', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = SeaObservation.new(sea_observation_params)
      # telegram.telegram_date = date_dev 
      if telegram.save
        new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.station.name, telegram: telegram.telegram}
        ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'sea'
        last_telegrams = SeaObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'sea', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, #telegram.telegram_date, 
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def get_last_telegrams
    telegrams = SeaObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'sea'}
  end
  
  def update_sea_telegram
    if @sea_observation.update_attributes sea_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  private
    def find_sea_observation
      @sea_observation = SeaObservation.find(params[:id])
    end
    
    def sea_observation_params
      params.require(:sea_observation).permit(:telegram, :station_id, :hour_observation, :date_observation)
    end
end
