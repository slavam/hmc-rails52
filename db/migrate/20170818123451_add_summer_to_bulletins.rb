class AddSummerToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column(:bulletins, :summer, :boolean, default: false)
  end
end
