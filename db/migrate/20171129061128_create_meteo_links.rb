class CreateMeteoLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :meteo_links do |t|
      t.string :name, null: false
      t.string :address, null: false
      t.boolean :is_active, default: true

      t.timestamps null: false
    end
  end
end
