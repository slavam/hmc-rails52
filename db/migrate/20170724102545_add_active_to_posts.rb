class AddActiveToPosts < ActiveRecord::Migration[5.1]
  def change
    add_column(:posts, :active, :boolean)
  end
end
