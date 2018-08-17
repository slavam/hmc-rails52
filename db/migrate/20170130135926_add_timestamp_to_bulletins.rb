class AddTimestampToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :created_at, :datetime)
    add_column(:bulletins, :updated_at, :datetime)
  end
end
