class AddObservedAtToSynopticObservations < ActiveRecord::Migration[5.2]
  def change
    add_column(:synoptic_observations, :observed_at, :datetime)
  end
end
