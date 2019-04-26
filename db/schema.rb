# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_04_22_073523) do

  create_table "agro_crop_categories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "agro_crops", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "agro_crop_category_id", null: false
    t.integer "code"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_agro_crops_on_code", unique: true
  end

  create_table "agro_damages", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "code"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "agro_dec_observations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.date "date_dev"
    t.integer "day_obs"
    t.integer "month_obs"
    t.text "telegram"
    t.integer "station_id"
    t.integer "telegram_num"
    t.integer "temperature_dec_avg_delta"
    t.decimal "temperature_dec_avg", precision: 5, scale: 1
    t.integer "temperature_dec_max"
    t.integer "hot_dec_day_num"
    t.integer "temperature_dec_min"
    t.integer "dry_dec_day_num"
    t.integer "temperature_dec_min_soil"
    t.integer "cold_soil_dec_day_num"
    t.integer "precipitation_dec"
    t.integer "wet_dec_day_num"
    t.integer "precipitation_dec_percent"
    t.integer "wind_speed_dec_max"
    t.integer "wind_speed_dec_max_day_num"
    t.integer "duster_dec_day_num"
    t.integer "temperature_dec_max_soil"
    t.integer "sunshine_duration_dec"
    t.integer "freezing_dec_day_num"
    t.integer "temperature_dec_avg_soil10"
    t.integer "temperature25_soil10_dec_day_num"
    t.integer "dew_dec_day_num"
    t.integer "saturation_deficit_dec_avg"
    t.integer "relative_humidity_dec_avg"
    t.integer "percipitation_dec_max"
    t.integer "percipitation5_dec_day_num"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "agro_observations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "telegram_type", default: "ЩЭАГЯ", null: false
    t.integer "station_id", null: false
    t.datetime "date_dev", null: false
    t.integer "day_obs", null: false
    t.integer "month_obs", null: false
    t.integer "telegram_num", default: 1, null: false
    t.text "telegram", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "temperature_max_12"
    t.decimal "temperature_avg_24", precision: 5, scale: 1
    t.integer "temperature_min_24"
    t.integer "temperature_min_soil_24"
    t.integer "percipitation_24"
    t.integer "percipitation_type"
    t.integer "percipitation_12"
    t.integer "wind_speed_max_24"
    t.integer "saturation_deficit_max_24"
    t.integer "duration_dew_24"
    t.integer "dew_intensity_max"
    t.integer "dew_intensity_8"
    t.integer "sunshine_duration_24"
    t.integer "state_top_layer_soil"
    t.integer "temperature_field_5_16"
    t.integer "temperature_field_10_16"
    t.integer "temperature_avg_soil_5"
    t.integer "temperature_avg_soil_10"
    t.integer "saturation_deficit_avg_24"
    t.integer "relative_humidity_min_24"
  end

  create_table "agro_phase_categories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
  end

  create_table "agro_phases", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "agro_phase_category_id", null: false
    t.integer "code"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "agro_works", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "code"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "applicants", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "telegram"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "message"
    t.string "telegram_type"
  end

  create_table "audits", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.text "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_id", "associated_type"], name: "associated_index"
    t.index ["auditable_id", "auditable_type"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "bulletins", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.date "report_date"
    t.string "curr_number"
    t.string "synoptic1"
    t.string "synoptic2"
    t.text "storm"
    t.text "forecast_day"
    t.text "forecast_period"
    t.text "forecast_advice"
    t.text "forecast_orientation"
    t.text "forecast_sea_day"
    t.text "forecast_sea_period"
    t.text "meteo_data"
    t.text "agro_day_review"
    t.text "climate_data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "duty_synoptic"
    t.text "forecast_day_city"
    t.boolean "summer", default: false
    t.string "bulletin_type", default: "daily"
    t.integer "storm_hour", default: 0
    t.integer "storm_minute", default: 0
    t.string "picture"
    t.string "chief"
    t.string "responsible"
  end

  create_table "chem_coefficients", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "material_id", null: false
    t.integer "laboratory_id", null: false
    t.decimal "calibration_factor", precision: 6, scale: 3
    t.decimal "aliquot_volume", precision: 5, scale: 2
    t.decimal "solution_volume", precision: 5, scale: 2
    t.decimal "sample_volume", precision: 7, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cities", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.integer "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "crop_conditions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "agro_observation_id"
    t.integer "crop_code", null: false
    t.integer "development_phase_1"
    t.integer "development_phase_2"
    t.integer "development_phase_3"
    t.integer "development_phase_4"
    t.integer "development_phase_5"
    t.integer "assessment_condition_1"
    t.integer "assessment_condition_2"
    t.integer "assessment_condition_3"
    t.integer "assessment_condition_4"
    t.integer "assessment_condition_5"
    t.integer "agricultural_work_1"
    t.integer "agricultural_work_2"
    t.integer "agricultural_work_3"
    t.integer "agricultural_work_4"
    t.integer "agricultural_work_5"
    t.integer "damage_plants_1"
    t.integer "damage_plants_2"
    t.integer "damage_plants_3"
    t.integer "damage_plants_4"
    t.integer "damage_plants_5"
    t.integer "damage_volume_1"
    t.integer "damage_volume_2"
    t.integer "damage_volume_3"
    t.integer "damage_volume_4"
    t.integer "damage_volume_5"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "index_weather_1"
    t.integer "index_weather_2"
    t.integer "index_weather_3"
    t.integer "index_weather_4"
    t.integer "index_weather_5"
  end

  create_table "crop_damages", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "agro_observation_id"
    t.integer "crop_code", null: false
    t.integer "height_snow_cover_rail"
    t.integer "depth_soil_freezing"
    t.integer "thermometer_index"
    t.integer "temperature_dec_min_soil3"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "crop_dec_conditions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "agro_dec_observation_id"
    t.integer "crop_code"
    t.integer "plot_code"
    t.integer "agrotechnology"
    t.integer "development_phase_1"
    t.integer "development_phase_2"
    t.integer "development_phase_3"
    t.integer "development_phase_4"
    t.integer "development_phase_5"
    t.integer "day_phase_1"
    t.integer "day_phase_2"
    t.integer "day_phase_3"
    t.integer "day_phase_4"
    t.integer "day_phase_5"
    t.integer "assessment_condition_1"
    t.integer "assessment_condition_2"
    t.integer "assessment_condition_3"
    t.integer "assessment_condition_4"
    t.integer "assessment_condition_5"
    t.integer "clogging_weeds"
    t.integer "height_plants"
    t.integer "number_plants"
    t.integer "average_mass"
    t.integer "agricultural_work_1"
    t.integer "agricultural_work_2"
    t.integer "agricultural_work_3"
    t.integer "agricultural_work_4"
    t.integer "agricultural_work_5"
    t.integer "day_work_1"
    t.integer "day_work_2"
    t.integer "day_work_3"
    t.integer "day_work_4"
    t.integer "day_work_5"
    t.integer "damage_plants_1"
    t.integer "damage_plants_2"
    t.integer "damage_plants_3"
    t.integer "damage_plants_4"
    t.integer "damage_plants_5"
    t.integer "day_damage_1"
    t.integer "day_damage_2"
    t.integer "day_damage_3"
    t.integer "day_damage_4"
    t.integer "day_damage_5"
    t.integer "damage_level_1"
    t.integer "damage_level_2"
    t.integer "damage_level_3"
    t.integer "damage_level_4"
    t.integer "damage_level_5"
    t.integer "damage_volume_1"
    t.integer "damage_volume_2"
    t.integer "damage_volume_3"
    t.integer "damage_volume_4"
    t.integer "damage_volume_5"
    t.integer "damage_space_1"
    t.integer "damage_space_2"
    t.integer "damage_space_3"
    t.integer "damage_space_4"
    t.integer "damage_space_5"
    t.integer "number_spicas"
    t.integer "num_bad_spicas"
    t.integer "number_stalks"
    t.integer "stalk_with_spike_num"
    t.integer "normal_size_potato"
    t.integer "losses"
    t.integer "grain_num"
    t.integer "bad_grain_percent"
    t.integer "bushiness"
    t.integer "shoots_inflorescences"
    t.decimal "grain1000_mass", precision: 5, scale: 1
    t.integer "moisture_reserve_10"
    t.integer "moisture_reserve_5"
    t.integer "soil_index"
    t.integer "moisture_reserve_2"
    t.integer "moisture_reserve_1"
    t.integer "temperature_water_2"
    t.integer "depth_water"
    t.integer "depth_groundwater"
    t.integer "depth_thawing_soil"
    t.integer "depth_soil_wetting"
    t.integer "height_snow_cover"
    t.integer "snow_retention"
    t.integer "snow_cover"
    t.decimal "snow_cover_density", precision: 5, scale: 2
    t.integer "number_measurements_0"
    t.integer "number_measurements_3"
    t.integer "number_measurements_30"
    t.integer "ice_crust"
    t.integer "thickness_ice_cake"
    t.integer "depth_thawing_soil_2"
    t.integer "depth_soil_freezing"
    t.integer "thaw_days"
    t.integer "thermometer_index"
    t.integer "temperature_dec_min_soil3"
    t.integer "height_snow_cover_rail"
    t.integer "viable_method"
    t.integer "soil_index_2"
    t.integer "losses_1"
    t.integer "losses_2"
    t.integer "losses_3"
    t.integer "losses_4"
    t.integer "temperature_dead50"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "donetsk_climate_sets", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "mm", null: false
    t.integer "dd", null: false
    t.decimal "t_avg", precision: 5, scale: 1
    t.decimal "t_max", precision: 5, scale: 1
    t.integer "year_max"
    t.decimal "t_min", precision: 5, scale: 1
    t.integer "year_min"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mm", "dd"], name: "index_donetsk_climate_sets_on_mm_and_dd", unique: true
  end

  create_table "hydro_observations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "hydro_type"
    t.integer "hydro_post_id"
    t.integer "day_obs"
    t.integer "hour_obs"
    t.date "date_observation"
    t.integer "content_factor"
    t.text "telegram"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "hydro_posts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "code"
    t.string "town"
    t.string "river"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "laboratories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "materials", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.string "unit"
    t.float "pdksr"
    t.float "pdkmax"
    t.float "vesmn"
    t.float "klop"
    t.float "imax"
    t.integer "v"
    t.float "grad"
    t.integer "point"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active"
  end

  create_table "measurements", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "post_id"
    t.date "date"
    t.integer "term"
    t.string "rhumb"
    t.integer "wind_direction"
    t.integer "wind_speed"
    t.decimal "temperature", precision: 4, scale: 1
    t.integer "phenomena"
    t.integer "relative_humidity"
    t.decimal "partial_pressure", precision: 4, scale: 1
    t.integer "atmosphere_pressure"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date", "term", "post_id"], name: "index_measurements_on_date_and_term_and_post_id", unique: true
  end

  create_table "meteo_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "address", null: false
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "other_observations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "data_type", null: false
    t.decimal "value", precision: 7, scale: 2
    t.date "obs_date"
    t.integer "station_id"
    t.string "source"
    t.string "description"
    t.string "period"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pollution_values", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "measurement_id"
    t.integer "material_id"
    t.float "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "concentration"
  end

  create_table "posts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "city_id"
    t.integer "site_type_id"
    t.string "name"
    t.integer "substances_num"
    t.integer "coordinates"
    t.integer "coordinates_sign"
    t.integer "vd"
    t.integer "height"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active"
    t.integer "laboratory_id"
    t.string "short_name"
    t.decimal "sample_volume_dust", precision: 7, scale: 2
  end

  create_table "radiation_observations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.date "date_observation", null: false
    t.integer "hour_observation"
    t.integer "station_id", null: false
    t.string "telegram", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sea_observations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.datetime "date_dev", null: false
    t.integer "term", null: false
    t.integer "day_obs", null: false
    t.integer "station_id", null: false
    t.string "telegram", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "site_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "snow_observations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "snow_type"
    t.integer "snow_point_id"
    t.integer "day_obs"
    t.integer "month_obs"
    t.integer "last_digit_year_obs"
    t.date "date_observation"
    t.text "telegram"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "snow_points", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.integer "code"
    t.string "snow_point_type", null: false
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "stations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.integer "code"
    t.string "address"
    t.decimal "latitude", precision: 13, scale: 9
    t.decimal "longitude", precision: 13, scale: 9
  end

  create_table "storm_observations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "telegram_type", default: "ЩЭОЯЮ", null: false
    t.integer "station_id", null: false
    t.integer "day_event", null: false
    t.integer "hour_event"
    t.integer "minute_event"
    t.string "telegram", null: false
    t.datetime "telegram_date"
  end

  create_table "synoptic_observations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.date "date"
    t.integer "term"
    t.string "telegram"
    t.integer "station_id"
    t.integer "cloud_base_height"
    t.integer "visibility_range"
    t.integer "cloud_amount_1"
    t.integer "wind_direction"
    t.integer "wind_speed_avg"
    t.decimal "temperature", precision: 5, scale: 1
    t.decimal "temperature_dew_point", precision: 5, scale: 1
    t.decimal "pressure_at_station_level", precision: 6, scale: 1
    t.decimal "pressure_at_sea_level", precision: 6, scale: 1
    t.integer "pressure_tendency_characteristic"
    t.decimal "pressure_tendency", precision: 6, scale: 1
    t.integer "precipitation_1"
    t.integer "precipitation_time_range_1"
    t.integer "weather_in_term"
    t.integer "weather_past_1"
    t.integer "weather_past_2"
    t.integer "cloud_amount_2"
    t.integer "clouds_1"
    t.integer "clouds_2"
    t.integer "clouds_3"
    t.decimal "temperature_dey_max", precision: 5, scale: 1
    t.decimal "temperature_night_min", precision: 5, scale: 1
    t.integer "underlying_surface_сondition"
    t.integer "snow_cover_height"
    t.decimal "sunshine_duration", precision: 5, scale: 1
    t.integer "cloud_amount_3"
    t.integer "cloud_form"
    t.integer "cloud_height"
    t.string "weather_data_add"
    t.integer "soil_surface_condition_1"
    t.integer "temperature_soil"
    t.integer "soil_surface_condition_2"
    t.decimal "temperature_soil_min", precision: 5, scale: 1
    t.integer "temperature_2cm_min"
    t.integer "precipitation_2"
    t.integer "precipitation_time_range_2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "observed_at"
    t.index ["date", "term", "station_id"], name: "index_synoptic_observations_on_date_and_term_and_station_id", unique: true
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "last_name"
    t.string "first_name"
    t.string "middle_name"
    t.string "login"
    t.string "password_digest"
    t.string "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_digest"
    t.string "role"
    t.integer "station_id"
    t.index ["login"], name: "index_users_on_login", unique: true
    t.index ["station_id"], name: "index_users_on_station_id"
  end

  add_foreign_key "users", "stations"
end
