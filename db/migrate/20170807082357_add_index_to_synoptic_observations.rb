class AddIndexToSynopticObservations < ActiveRecord::Migration[5.2]
  def change
    add_index :synoptic_observations, [:date, :term, :station_id], unique: true
  end
end
