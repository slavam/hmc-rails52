class CreateHydroObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :hydro_observations do |t|
      t.string :hydro_type
      t.integer :hydro_post_id
      t.integer :day_obs
      t.integer :hour_obs
      t.date :date_observation
      t.integer :content_factor
      t.text :telegram
      t.timestamps null: false
    end
  end
end
