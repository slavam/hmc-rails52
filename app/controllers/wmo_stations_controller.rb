class WmoStationsController < ApplicationController
  before_action :find_wmo_station, only: [:edit, :destroy, :update]
  def index
    @wmo_stations = WmoStation.paginate(page: params[:page]).order(:code)
  end
  
  def edit
  end
  
  def destroy
  end
  
  def update
    if @wmo_station.update_attributes wmo_station_params
      redirect_to wmo_stations_path
    else
      render action: :edit
    end
  end
  
  def find_by_code
    code = params[:code].present? : params[:code] : nil
    if code
      station = WmoStation.find_by_code(:code)
      if station
      end
    end
  end
  
  private
    def find_wmo_station
      @wmo_station = WmoStation.find(params[:id])
    end
    
    def wmo_station_params
      params.require(:wmo_station).permit(:code, :name, :country, :latitude, :longitude, :altitude, :is_active)
    end
end