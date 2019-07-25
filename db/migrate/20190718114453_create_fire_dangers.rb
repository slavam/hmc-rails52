class CreateFireDangers < ActiveRecord::Migration[5.2]
  def change
    create_table :fire_dangers do |t|
      t.date :observation_date
      t.integer :station_id
      t.integer :fire_danger
      t.decimal :temperature, precision: 5, scale: 1
      t.decimal :temperature_dew_point, precision: 5, scale: 1
      t.decimal :precipitation_night, precision: 5, scale: 1
      t.decimal :precipitation_day, precision: 5, scale: 1

      t.timestamps
    end
  end
end
