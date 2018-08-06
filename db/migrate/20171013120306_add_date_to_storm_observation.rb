class AddDateToStormObservation < ActiveRecord::Migration[5.1]
  def change
    add_column :storm_observations, :telegram_date, :date
  end
end
