class RemoveFieldsFromLaboratories < ActiveRecord::Migration[5.2]
  def change
    remove_columns(:laboratories, :calibration_factor, :aliquot_volume, :solution_volume, :sample_volume)
  end
end
