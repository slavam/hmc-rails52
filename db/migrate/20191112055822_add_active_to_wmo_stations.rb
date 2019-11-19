class AddActiveToWmoStations < ActiveRecord::Migration[5.2]
  def change
    add_column(:wmo_stations, :is_active, :boolean, default: false)
  end
end
