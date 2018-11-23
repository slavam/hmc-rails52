class AddChiefResponsibleToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :chief, :string)
    add_column(:bulletins, :responsible, :string)
  end
end
