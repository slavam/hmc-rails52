class AddIndexToMeasurements < ActiveRecord::Migration[5.2]
  def change
    add_index :measurements, [:date, :term, :post_id], unique: true
  end
end
