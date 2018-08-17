class ChangeDateDevTypeToSeaObservations < ActiveRecord::Migration[5.2]
  def change
    change_column :sea_observations, :date_dev, :datetime
  end
end
