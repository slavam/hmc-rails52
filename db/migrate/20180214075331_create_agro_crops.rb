class CreateAgroCrops < ActiveRecord::Migration[5.2]
  def change
    create_table :agro_crops do |t|
      t.references :agro_crop_category, :null => false
      t.integer :code
      t.string :name

      t.timestamps null: false
    end
    add_index :agro_crops, :code, unique: true
  end
end
