class CreatePlaydays < ActiveRecord::Migration[5.2]
  def change
    create_table :playdays do |t|
      t.integer :pd_year
      t.integer :pd_month
      t.integer :pd_day
      t.string :description

      t.timestamps
    end
  end
end
