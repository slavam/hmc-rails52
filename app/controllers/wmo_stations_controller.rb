class WmoStationsController < ApplicationController
  before_action :find_wmo_station, only: [:edit, :destroy, :update, :edit_station]
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
    code = params[:code].present? ? params[:code] : nil
    if code
      station = WmoStation.find_by_code(code).as_json
      if station.present?
        station.delete('updated_at')
        station.delete('created_at')
      end
      render json: {station: station}
    end
  end
  
  def edit_station
    if @wmo_station.update_attributes wmo_station_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  private
    def find_wmo_station
      @wmo_station = WmoStation.find(params[:id])
    end
    
    def wmo_station_params
      params.require(:wmo_station).permit(:code, :name, :country, :latitude, :longitude, :altitude, :is_active, :is_active_2500, :is_active_5000)
    end
end