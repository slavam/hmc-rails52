class CreateRadiationObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :radiation_observations do |t|
      t.date        :date_observation, null: false                # дата наблюдения
      t.integer     :hour_observation                             # GG час наблюдения
      t.integer     :station_id, null: false                      # ссылка на станцию
      t.string      :telegram, null: false                        # текст телеграммы

      t.timestamps
    end
  end
end
