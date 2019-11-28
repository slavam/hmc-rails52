class AddActiveByScaleToWmoStations < ActiveRecord::Migration[5.2]
  def change
    add_column(:wmo_stations, :is_active_2500, :boolean, default: false)
    add_column(:wmo_stations, :is_active_5000, :boolean, default: false)
  end
end
