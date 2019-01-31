class CreateSnowObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :snow_observations do |t|
      t.string :snow_type
      t.integer :snow_point_id
      t.integer :day_obs
      t.integer :month_obs
      t.integer :last_digit_year_obs
      t.date :date_observation
      t.text :telegram
      t.timestamps
    end
  end
end
