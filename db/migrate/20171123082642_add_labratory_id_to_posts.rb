class AddLabratoryIdToPosts < ActiveRecord::Migration[5.1]
  def change
    add_column(:posts, :laboratory_id, :integer)
  end
end
