class AddFieldsToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :duty_synoptic, :string)
    add_column(:bulletins, :forecast_day_city, :text)
  end
end
