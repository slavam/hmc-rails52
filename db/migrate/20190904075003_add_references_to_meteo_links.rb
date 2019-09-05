class AddReferencesToMeteoLinks < ActiveRecord::Migration[5.2]
  def change
    # add_column(:meteo_links, :user_id, :integer)
    add_column(:meteo_links, :user_menu_id, :integer)
    change_column(:meteo_links, :user_id, :integer)
    # add_reference :meteo_links, :user, index: true, foreign_key: true
    # add_reference :meteo_links, :user_menu, index: true, foreign_key: true
  end
end
