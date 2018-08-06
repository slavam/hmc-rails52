class AddConcentrationOnPolutionValues < ActiveRecord::Migration[5.1]
  def change
    add_column(:pollution_values, :concentration, :float)
  end
end
