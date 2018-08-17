class AddActiveToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column(:posts, :active, :boolean)
  end
end
