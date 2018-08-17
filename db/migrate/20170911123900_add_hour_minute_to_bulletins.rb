class AddHourMinuteToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :storm_hour, :integer, default: 0)
    add_column(:bulletins, :storm_minute, :integer, default: 0)
  end
end
