class CreateSiteTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :site_types do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
