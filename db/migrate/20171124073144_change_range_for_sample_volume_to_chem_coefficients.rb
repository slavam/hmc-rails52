class ChangeRangeForSampleVolumeToChemCoefficients < ActiveRecord::Migration[5.2]
  def change
    change_column :chem_coefficients, :sample_volume, :decimal, precision: 7, scale: 2
  end
end
