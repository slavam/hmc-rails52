class ChangeTelegramTypeToAgroObservations < ActiveRecord::Migration[5.1]
  def change
    change_column(:agro_observations, :telegram, :text)
  end
end
