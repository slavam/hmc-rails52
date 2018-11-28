Rails.application.routes.draw do
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
  resources :agro_observations
  resources :meteo_links
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
  resources :storm_observations
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
  resources :synoptic_observations
  get 'sessions/new'
  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  resources :users
  resources :audits
  
  get 'bulletins/print_bulletin', to: 'bulletins#print_bulletin'
  get 'bulletins/new_sea_bulletin', to: 'bulletins#new_sea_bulletin'
  get 'bulletins/new_radiation_bulletin', to: 'bulletins#new_radiation_bulletin'
  get 'bulletins/new_tv_bulletin', to: 'bulletins#new_tv_bulletin'
  get 'bulletins/new_storm_bulletin', to: 'bulletins#new_storm_bulletin'
  get 'bulletins/new_holiday_bulletin', to: 'bulletins#new_holiday_bulletin'
  get 'bulletins/new_avtodor_bulletin', to: 'bulletins#new_avtodor_bulletin'
  get 'bulletins/:id/bulletin_show', to: 'bulletins#bulletin_show'
  get 'bulletins/list', to: 'bulletins#list'
  get 'bulletins/help_show', to: 'bulletins#help_show'
  get 'bulletins/bulletins_select', to: 'bulletins#bulletins_select'
  resources :bulletins
    delete 'pollution_values/delete_value/:id', to: 'pollution_values#delete_value'
  get 'pollution_values/background_concentrations', to: 'pollution_values#background_concentrations'
  # get 'pollution_values/get_chem_bc_data', to: 'pollution_values#get_chem_bc_data'
  resources :pollution_values
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
  resources :cities
  resources :stations
  resources :chem_coefficients
  resources :laboratories
  root 'sessions#new'
  mount ActionCable.server, at: '/cable'
end
