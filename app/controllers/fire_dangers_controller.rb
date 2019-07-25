class FireDangersController < ApplicationController
  def index 
    @fire_dangers = FireDanger.all.paginate(page: params[:page]).order(:observation_date).reverse_order.order(:station_id)
  end
  
  def daily_fire_danger
    @report_date = params[:report_date].present? ? params[:report_date] : Time.now.strftime("%Y-%m-%d")
    @stations = Station.all.order(:id)
    @daily_fire_dangers = FireDanger.where(observation_date: @report_date).order(:station_id)
    respond_to do |format|
      format.html
      format.json do 
        render json: {fireDangers: @daily_fire_dangers}
      end
    end
  end
  
  private
    def fire_danger_params
      params.require(:fire_danger).permit(:date_observation, :station_id, :fire_danger, :temperature, :temperature_dew_point, :precipitation_day, :precipitation_night)
    end
end
