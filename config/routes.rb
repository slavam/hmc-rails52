Rails.application.routes.draw do
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
  resources :storm_observations
  post 'synoptic_observations/create_synoptic_telegram', to: 'synoptic_observations#create_synoptic_telegram'
  put 'synoptic_observations/update_synoptic_telegram', to: 'synoptic_observations#update_synoptic_telegram'
  get '/search_synoptic_telegrams', to: 'synoptic_observations#search_synoptic_telegrams'
  get 'synoptic_observations/synoptic_storm_telegrams', to: 'synoptic_observations#synoptic_storm_telegrams'
  get 'synoptic_observations/heat_donbass_show', to: 'synoptic_observations#heat_donbass_show'
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
  get 'bulletins/:id/bulletin_show', to: 'bulletins#bulletin_show'
  get 'bulletins/list', to: 'bulletins#list'
  get 'bulletins/help_show', to: 'bulletins#help_show'
  resources :bulletins
  
  root 'sessions#new'
  mount ActionCable.server, at: '/cable'
end
