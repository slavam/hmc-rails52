class AddBulletinTypeToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :bulletin_type, :string, default: 'daily')
  end
end
