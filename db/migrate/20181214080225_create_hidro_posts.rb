class CreateHidroPosts < ActiveRecord::Migration[5.2]
  def change
    create_table :hydro_posts do |t|
      t.integer :code
      t.string :town
      t.string :river
      t.timestamps null: false
    end
  end
end
