class CreateAgroWorks < ActiveRecord::Migration[5.2]
  def change
    create_table :agro_works do |t|
      t.integer :code
      t.string :name

      t.timestamps null: false
    end
  end
end
