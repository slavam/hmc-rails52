class AddAddressLatLongToStations < ActiveRecord::Migration[5.2]
  def change
    add_column(:stations, :address, :string)
    add_column(:stations, :latitude, :decimal, :precision => 13, :scale => 9)
    add_column(:stations, :longitude, :decimal, :precision => 13, :scale => 9)
  end
end
