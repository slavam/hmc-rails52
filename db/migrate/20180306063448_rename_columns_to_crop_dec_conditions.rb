class RenameColumnsToCropDecConditions < ActiveRecord::Migration[5.2]
  def change
    rename_column :crop_dec_conditions, :crop_id, :crop_code
    rename_column :crop_dec_conditions, :plot_id, :plot_code
  end
end
