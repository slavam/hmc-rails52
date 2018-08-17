class AddSampleVolumeDustToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column(:posts, :sample_volume_dust, :decimal, precision: 7, scale: 2)
  end
end
