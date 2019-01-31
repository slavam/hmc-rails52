class CreateSnowPoints < ActiveRecord::Migration[5.2]
  def change
    create_table :snow_points do |t|
      t.string  :name, null: false
      t.integer :code
      t.string  :snow_point_type
      t.boolean :is_active, default: true

      t.timestamps
    end
  end
end
