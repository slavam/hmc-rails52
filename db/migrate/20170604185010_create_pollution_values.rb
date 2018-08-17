class CreatePollutionValues < ActiveRecord::Migration[5.2]
  def change
    create_table :pollution_values do |t|
      t.integer :measurement_id
      t.integer :material_id
      t.float :value

      t.timestamps null: false
    end
  end
end
