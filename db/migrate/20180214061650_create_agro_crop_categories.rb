class CreateAgroCropCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :agro_crop_categories do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
