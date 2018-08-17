class AddPictureToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column :bulletins, :picture, :string
  end
end
