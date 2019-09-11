class ChangeNullForFields < ActiveRecord::Migration[5.2]
  def change
    change_column :agro_crops, :agro_crop_category_id, :integer, null: true
    change_column :agro_observations, :station_id, :integer, null: true
    change_column :agro_observations, :date_dev, :datetime, default: Time.now
    change_column :agro_observations, :day_obs, :integer, null: true
    change_column :agro_observations, :month_obs, :integer, null: true
    change_column :agro_observations, :telegram, :text, null: true
    change_column :agro_phases, :agro_phase_category_id, :integer, null: true
    change_column :bulletin_editors, :user_id, :integer, null: true
    change_column :bulletin_editors, :bulletin_id, :integer, null: true
    change_column :chem_coefficients, :material_id, :integer, null: true
    change_column :chem_coefficients, :laboratory_id, :integer, null: true
    change_column :crop_conditions, :crop_code, :integer, null: true
    change_column :crop_damages, :crop_code, :integer, null: true
    change_column :donetsk_climate_sets, :mm, :integer, null: true
    change_column :donetsk_climate_sets, :dd, :integer, null: true
    change_column :laboratories, :name, :string, null: true
    change_column :meteo_links, :name, :string, null: true
    change_column :meteo_links, :address, :string, null: true
    change_column :other_observations, :data_type, :string, default: "temp"
    change_column :radiation_observations, :date_observation, :datetime, default: Time.now
    change_column :radiation_observations, :station_id, :integer, null: true
    change_column :radiation_observations, :telegram, :string, null: true
    change_column :sea_observations, :date_dev, :datetime, default: Time.now
    change_column :sea_observations, :term, :integer, null: true
    change_column :sea_observations, :day_obs, :integer, null: true
    change_column :sea_observations, :station_id, :integer, null: true
    change_column :sea_observations, :telegram, :string, null: true
    change_column :snow_points, :name, :string, null: true
    change_column :snow_points, :snow_point_type, :string, null: true
    change_column :storm_observations, :station_id, :integer, null: true
    change_column :storm_observations, :day_event, :integer, null: true
    change_column :storm_observations, :telegram, :string, null: true
    change_column :user_menus, :name, :string, null: true
  end
end
