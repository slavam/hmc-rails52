class ChangeTelegramTypeToAgroDecObservations < ActiveRecord::Migration[5.1]
  def change
    change_column(:agro_dec_observations, :telegram, :text)
  end
end
