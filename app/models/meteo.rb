class Meteo < ActiveRecord::Base
  establish_connection ENV["RAILS_ENV"] == 'production' ? :meteo : :meteo2017
  self.abstract_class = true
end
