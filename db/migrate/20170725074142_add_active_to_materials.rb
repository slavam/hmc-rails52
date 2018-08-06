class AddActiveToMaterials < ActiveRecord::Migration[5.1]
  def change
    add_column(:materials, :active, :boolean)
  end
end
