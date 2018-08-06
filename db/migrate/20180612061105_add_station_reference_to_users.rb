class AddStationReferenceToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :station, index: true, foreign_key: true
  end
end
