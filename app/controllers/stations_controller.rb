class StationsController < ApplicationController
  before_action :require_admin, :only => :edit
  before_action :find_station, only: [:edit, :update]
  before_action :cors_preflight_check
  
  def cors_preflight_check
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  end
  def index
    @stations = Station.all.order(:name)
    respond_to do |format|
      format.html
      format.json do
        render json: {stations: @stations}
      end
    end
  end
  
  def edit
  end
  
  def update
    if not @station.update station_params
      render :action => :edit
    else
      redirect_to stations_path
    end
  end
  
  private
    def find_station
      @station = Station.find(params[:id])
    end
  
    def station_params
      params.require(:station).permit(:name, :code, :address, :latitude, :longitude)
    end
end
