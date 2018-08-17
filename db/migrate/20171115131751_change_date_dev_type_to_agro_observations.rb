class ChangeDateDevTypeToAgroObservations < ActiveRecord::Migration[5.2]
  def change
    change_column :agro_observations, :date_dev, :datetime
  end
end
