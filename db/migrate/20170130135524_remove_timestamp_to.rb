class RemoveTimestampTo < ActiveRecord::Migration[5.1]
  def change
    remove_column :bulletins, :created_at
    remove_column :bulletins, :upeated_at
  end
end
