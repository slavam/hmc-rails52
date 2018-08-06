class AddPictureToBulletins < ActiveRecord::Migration[5.1]
  def change
    add_column :bulletins, :picture, :string
  end
end
