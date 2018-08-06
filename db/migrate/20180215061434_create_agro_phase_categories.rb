class CreateAgroPhaseCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :agro_phase_categories do |t|
      t.string :name
    end
  end
end
