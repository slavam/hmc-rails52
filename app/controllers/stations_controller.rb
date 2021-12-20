class StationsController < ApplicationController
  before_action :require_admin, :only => :edit
  before_action :find_station, only: [:edit, :update]
  def index
    @stations = Station.all.order(:name)
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