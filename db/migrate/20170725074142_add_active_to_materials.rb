class AddActiveToMaterials < ActiveRecord::Migration[5.2]
  def change
    add_column(:materials, :active, :boolean)
  end
end
