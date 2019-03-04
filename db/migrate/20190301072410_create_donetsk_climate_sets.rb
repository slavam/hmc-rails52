class CreateDonetskClimateSets < ActiveRecord::Migration[5.2]
  def change
    create_table :donetsk_climate_sets do |t|
      t.integer :mm, null: false
      t.integer :dd, null: false
      t.decimal :t_avg, precision: 5, scale: 1
      t.decimal :t_max, precision: 5, scale: 1
      t.integer :year_max
      t.decimal :t_min, precision: 5, scale: 1
      t.integer :year_min
      
      t.timestamps
    end
    add_index :donetsk_climate_sets, [:mm, :dd], unique: true
  end
end
