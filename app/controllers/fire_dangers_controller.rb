class FireDangersController < ApplicationController
  before_action :find_fire_danger, only: [:edit, :update] 
  def index 
    @fire_dangers = FireDanger.all.paginate(page: params[:page]).order(:observation_date).reverse_order.order(:station_id)
  end
  
  def daily_fire_danger
    @report_date = params[:report_date].present? ? params[:report_date] : Time.now.strftime("%Y-%m-%d")
    @stations = Station.all.order(:id)
    # @daily_fire_dangers = FireDanger.where(observation_date: @report_date).order(:station_id)
    @daily_fire_dangers = FireDanger.where("observation_date = ? and station_id not in (4,8)", @report_date).order(:station_id)
    respond_to do |format|
      format.html
      format.json do 
        render json: {fireDangers: @daily_fire_dangers}
      end
    end
  end
  
  def edit
  end
  
  def update
    if not @fire_danger.update fire_danger_params
      render :action => :edit
    else
      flash[:success] = "Изменено значение пожарной опасности"
      redirect_to fire_dangers_path
    end
  end
  
  private
    def find_fire_danger
      @fire_danger = FireDanger.find(params[:id])
    end
    
    def fire_danger_params
      params.require(:fire_danger).permit(:date_observation, :station_id, :fire_danger, :temperature, :temperature_dew_point, :precipitation_day, :precipitation_night)
    end
end
