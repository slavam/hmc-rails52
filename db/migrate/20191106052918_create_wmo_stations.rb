class CreateWmoStations < ActiveRecord::Migration[5.2]
  def change
    create_table :wmo_stations do |t|
      t.integer :code
      t.string :name
      t.string :country
      t.decimal :latitude, precision: 13, scale: 9
      t.decimal :longitude, precision: 13, scale: 9
      t.integer :altitude
      t.timestamps
    end
    add_index :wmo_stations, :code, unique: true
  end
end
