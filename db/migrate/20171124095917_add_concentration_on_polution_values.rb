class AddConcentrationOnPolutionValues < ActiveRecord::Migration[5.2]
  def change
    add_column(:pollution_values, :concentration, :float)
  end
end
