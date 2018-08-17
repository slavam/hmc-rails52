class AddShortNameToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column(:posts, :short_name, :string)
  end
end
