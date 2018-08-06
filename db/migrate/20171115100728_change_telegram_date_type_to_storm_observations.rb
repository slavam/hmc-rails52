class ChangeTelegramDateTypeToStormObservations < ActiveRecord::Migration[5.1]
  def change
    change_column :storm_observations, :telegram_date, :datetime
  end
end
