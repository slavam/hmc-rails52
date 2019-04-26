class CreateOtherObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :other_observations do |t|
      t.string :data_type, null: false  # temp, perc, min_hum, fros, rad
      t.decimal :value, precision: 7, scale: 2
      t.date    :obs_date
      t.integer :station_id
      t.string  :source # Макеевка, Кировский, Авдотьино
      t.string  :description # дождь, снег
      t.string  :period  # day, night

      t.timestamps
    end
  end
end
