Rails.application.routes.draw do
  get 'union_forecasts/:id/union_forecast_show', to: 'union_forecasts#union_forecast_show'
  # get 'union_forecasts/create'
  resources :union_forecasts
  resources :playdays
  get 'fire_dangers/daily_fire_danger', to: 'fire_dangers#daily_fire_danger'
  resources :fire_dangers
  get 'other_observations/input_other_telegrams', to: 'other_observations#input_other_telegrams'
  post 'other_observations/create_other_data', to: 'other_observations#create_other_data'
  get 'other_observations/get_last_telegrams', to: 'other_observations#get_last_telegrams'
  delete 'other_observations/delete_other_data/:id', to: 'other_observations#delete_other_data'
  get 'other_observations/monthly_precipitation', to: 'other_observations#monthly_precipitation'
  get 'other_observations/monthly_temperatures', to: 'other_observations#monthly_temperatures'
  resources :other_observations
  resources :donetsk_climate_sets
  get 'snow_observations/input_snow_telegrams', to: 'snow_observations#input_snow_telegrams'
  post 'snow_observations/create_snow_telegram', to: 'snow_observations#create_snow_telegram'
  get 'snow_observations/get_last_telegrams', to: 'snow_observations#get_last_telegrams'
  put 'snow_observations/update_snow_telegram', to: 'snow_observations#update_snow_telegram'
  resources :snow_observations
  resources :snow_points
  get 'hydro_observations/input_hydro_telegrams', to: 'hydro_observations#input_hydro_telegrams'
  get 'hydro_observations/get_last_telegrams', to: 'hydro_observations#get_last_telegrams'
  post 'hydro_observations/create_hydro_telegram', to: 'hydro_observations#create_hydro_telegram'
  put 'hydro_observations/update_hydro_telegram', to: 'hydro_observations#update_hydro_telegram'
  resources :hydro_observations
  get 'sea_observations/conversion_log_download', to: 'sea_observations#conversion_log_download'
  get 'sea_observations/get_conversion_interval', to: 'sea_observations#get_conversion_interval'
  post 'sea_observations/converter', to: 'sea_observations#converter'
  get 'sea_observations/input_sea_telegrams', to: 'sea_observations#input_sea_telegrams'
  post 'sea_observations/create_sea_telegram', to: 'sea_observations#create_sea_telegram'
  get 'sea_observations/get_last_telegrams', to: 'sea_observations#get_last_telegrams'
  put 'sea_observations/update_sea_telegram', to: 'sea_observations#update_sea_telegram'
  resources :sea_observations
  get 'radiation_observations/input_radiation_telegrams', to: 'radiation_observations#input_radiation_telegrams'
  post 'radiation_observations/create_radiation_telegram', to: 'radiation_observations#create_radiation_telegram'
  get 'radiation_observations/get_last_telegrams', to: 'radiation_observations#get_last_telegrams'
  put 'radiation_observations/update_radiation_telegram', to: 'radiation_observations#update_radiation_telegram'
  resources :radiation_observations
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'applicants/to_buffer', to: 'applicants#to_buffer'
  get 'applicants/applicants_list', to: 'applicants#applicants_list'
  delete 'applicants/delete_applicant/:id', to: 'applicants#delete_applicant'
  resources :applicants
  get 'agro_dec_observations/search_agro_dec_telegrams', to: 'agro_dec_observations#search_agro_dec_telegrams'
  post 'agro_dec_observations/create_agro_dec_telegram', to: 'agro_dec_observations#create_agro_dec_telegram'
  get 'agro_dec_observations/get_last_telegrams', to: 'agro_dec_observations#get_last_telegrams'
  get 'agro_dec_observations/input_agro_dec_telegrams', to: 'agro_dec_observations#input_agro_dec_telegrams'
  put 'agro_dec_observations/update_agro_dec_telegram', to: 'agro_dec_observations#update_agro_dec_telegram'
  get 'agro_dec_observations/agro_meteo_data', to: 'agro_dec_observations#agro_meteo_data'
  resources :agro_dec_observations
  resources :agro_works
  resources :agro_damages
  resources :agro_phases
  resources :agro_crops
  resources :agro_crop_categories
  resources :agro_phase_categories
  get 'agro_observations/search_agro_telegrams', to: 'agro_observations#search_agro_telegrams'
  post 'agro_observations/create_agro_telegram', to: 'agro_observations#create_agro_telegram'
  get 'agro_observations/get_last_telegrams', to: 'agro_observations#get_last_telegrams'
  get 'agro_observations/input_agro_telegrams', to: 'agro_observations#input_agro_telegrams'
  put 'agro_observations/update_agro_telegram', to: 'agro_observations#update_agro_telegram'
  get 'agro_observations/agro_month_data', to: 'agro_observations#agro_month_data'
  resources :agro_observations
  resources :meteo_links
  get 'storm_observations/latest_storms', to: 'storm_observations#latest_storms'
  get 'storm_observations/search_storm_telegrams', to: 'storm_observations#search_storm_telegrams'
  post 'storm_observations/create_storm_telegram', to: 'storm_observations#create_storm_telegram'
  get 'storm_observations/get_last_telegrams', to: 'storm_observations#get_last_telegrams'
  get 'storm_observations/input_storm_telegrams', to: 'storm_observations#input_storm_telegrams'
  put 'storm_observations/update_storm_telegram', to: 'storm_observations#update_storm_telegram'
  get 'storm_observations/get_conversion_params', to: 'storm_observations#get_conversion_params'
  post 'storm_observations/converter', to: 'storm_observations#converter'
  get 'storm_observations/storms_4_download', to: 'storm_observations#storms_4_download'
  post 'storm_observations/storm_to_arm_syn', to: 'storm_observations#storm_to_arm_syn'
  get 'storm_observations/storms_4_arm_syn', to: 'storm_observations#storms_4_arm_syn'
  get 'storm_observations/storms_download_2_arm_syn', to: 'storm_observations#storms_download_2_arm_syn'
  get 'storm_observations/storm_description', to: 'storm_observations#storm_description'
  resources :storm_observations
  # get 'synoptic_observations/:id/edit_synoptic_data', to: 'synoptic_observations#edit_synoptic_data'
  # get 'synoptic_observations/new_synoptic_data', to: 'synoptic_observations#new_synoptic_data'
  get 'synoptic_observations/find_term_telegrams', to: 'synoptic_observations#find_term_telegrams'
  get 'synoptic_observations/get_date_term_station', to: 'synoptic_observations#get_date_term_station'
  get 'synoptic_observations/test_telegram', to: 'synoptic_observations#test_telegram'
  get 'synoptic_observations/fire', to: 'synoptic_observations#fire'
  # get 'synoptic_observations/arm_sin_files_from_a_directory', to: 'synoptic_observations#arm_sin_files_from_a_directory'
  get 'synoptic_observations/download_arm_sin_file', to: 'synoptic_observations#download_arm_sin_file'
  get 'synoptic_observations/arm_sin_files_list', to: 'synoptic_observations#arm_sin_files_list'
  post 'synoptic_observations/arm_sin_data_fetch', to: 'synoptic_observations#arm_sin_data_fetch'
  get 'synoptic_observations/telegrams_4_download', to: 'synoptic_observations#telegrams_4_download'
  post 'synoptic_observations/create_synoptic_telegram', to: 'synoptic_observations#create_synoptic_telegram'
  put 'synoptic_observations/update_synoptic_telegram', to: 'synoptic_observations#update_synoptic_telegram'
  get '/search_synoptic_telegrams', to: 'synoptic_observations#search_synoptic_telegrams'
  get 'synoptic_observations/synoptic_storm_telegrams', to: 'synoptic_observations#synoptic_storm_telegrams'
  get 'synoptic_observations/heat_donbass_show', to: 'synoptic_observations#heat_donbass_show'
  get 'synoptic_observations/heat_donbass_rx', to: 'synoptic_observations#heat_donbass_rx'
  get 'synoptic_observations/get_temps', to: 'synoptic_observations#get_temps'
  get 'synoptic_observations/input_synoptic_telegrams', to: 'synoptic_observations#input_synoptic_telegrams'
  get 'synoptic_observations/get_last_telegrams', to: 'synoptic_observations#get_last_telegrams'
  get 'synoptic_observations/get_conversion_params', to: 'synoptic_observations#get_conversion_params'
  post 'synoptic_observations/converter', to: 'synoptic_observations#converter'
  get 'synoptic_observations/get_meteoparams', to: 'synoptic_observations#get_meteoparams'
  get 'synoptic_observations/teploenergo', to: 'synoptic_observations#teploenergo'
  get 'synoptic_observations/teploenergo5', to: 'synoptic_observations#teploenergo5'
  get 'synoptic_observations/tpp', to: 'synoptic_observations#tpp'
  get 'synoptic_observations/dnmu', to: 'synoptic_observations#dnmu'
  get 'synoptic_observations/donsnab', to: 'synoptic_observations#donsnab'
  get 'synoptic_observations/energy', to: 'synoptic_observations#energy'
  get 'synoptic_observations/energy_1510', to: 'synoptic_observations#energy_1510'
  get 'synoptic_observations/temperatures_lower8', to: 'synoptic_observations#temperatures_lower8'
  get 'synoptic_observations/daily_avg_temp', to: 'synoptic_observations#daily_avg_temp'
  get 'synoptic_observations/month_avg_temp', to: 'synoptic_observations#month_avg_temp'
  get 'synoptic_observations/conversion_log_download', to: 'synoptic_observations#conversion_log_download'
  # get 'synoptic_observations/wmo_stations_create', to: 'synoptic_observations#wmo_stations_create'
  get 'synoptic_observations/surface_map_show', to: 'synoptic_observations#surface_map_show'
  resources :synoptic_observations
  get 'sessions/new'
  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  resources :users
  resources :old_agro_telegrams, only: [:index]
  resources :user_menus
  resources :audits
  get 'bulletins/latest_bulletins', to: 'bulletins#latest_bulletins'
  get 'bulletins/print_bulletin', to: 'bulletins#print_bulletin'
  get 'bulletins/new_sea_bulletin', to: 'bulletins#new_sea_bulletin'
  get 'bulletins/new_radiation_bulletin', to: 'bulletins#new_radiation_bulletin'
  get 'bulletins/new_tv_bulletin', to: 'bulletins#new_tv_bulletin'
  get 'bulletins/new_storm_bulletin', to: 'bulletins#new_storm_bulletin'
  get 'bulletins/new_holiday_bulletin', to: 'bulletins#new_holiday_bulletin'
  get 'bulletins/new_avtodor_bulletin', to: 'bulletins#new_avtodor_bulletin'
  get 'bulletins/new_bulletin', to: 'bulletins#new_bulletin'
  get 'bulletins/:id/bulletin_show', to: 'bulletins#bulletin_show'
  get 'bulletins/list', to: 'bulletins#list'
  get 'bulletins/help_show', to: 'bulletins#help_show'
  get 'bulletins/bulletins_select', to: 'bulletins#bulletins_select'
  resources :bulletins
    delete 'pollution_values/delete_value/:id', to: 'pollution_values#delete_value'
  get 'pollution_values/background_concentrations', to: 'pollution_values#background_concentrations'
  # get 'pollution_values/get_chem_bc_data', to: 'pollution_values#get_chem_bc_data'
  resources :pollution_values
  get 'measurements/search_measurements', to: 'measurements#search_measurements'
  get 'measurements/chem_forma1_as_protocol', to: 'measurements#chem_forma1_as_protocol'
  get 'measurements/weather_update', to: 'measurements#weather_update'
  get 'measurements/get_weather_and_concentrations', to: 'measurements#get_weather_and_concentrations'
  post 'measurements/save_pollutions', to: 'measurements#save_pollutions'
  post 'measurements/create_or_update', to: 'measurements#create_or_update'
  get 'measurements/get_convert_params', to: 'measurements#get_convert_params'
  get 'measurements/chem_forma2', to: 'measurements#chem_forma2'
  get 'measurements/chem_forma1_tza', to: 'measurements#chem_forma1_tza'
  get 'measurements/get_chem_forma1_tza_data', to: 'measurements#get_chem_forma1_tza_data'
  get 'measurements/print_forma1_tza', to: 'measurements#print_forma1_tza'
  get 'measurements/get_chem_forma2_data', to: 'measurements#get_chem_forma2_data'
  get 'measurements/print_forma2', to: 'measurements#print_forma2'
  post 'measurements/convert_akiam', to: 'measurements#convert_akiam'
  get 'measurements/observations_quantity', to: 'measurements#observations_quantity'
  get 'measurements/wind_rose', to: 'measurements#wind_rose'
  post 'measurements/print_wind_rose', to: 'measurements#print_wind_rose'
  get 'measurements/print_wind_rose', to: 'measurements#print_wind_rose'
  get 'measurements/calc_normal_volume', to: 'measurements#calc_normal_volume'
  resources :measurements
  resources :materials
  resources :posts
  resources :hydro_posts
  resources :cities
  resources :stations
  resources :chem_coefficients
  resources :laboratories
  put 'wmo_stations/edit_station', to: 'wmo_stations#edit_station'
  get 'wmo_stations/find_by_code', to: 'wmo_stations#find_by_code'
  resources :wmo_stations
  root 'sessions#new'
  mount ActionCable.server, at: '/cable'
end
