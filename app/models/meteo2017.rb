class Meteo2017 < ActiveRecord::Base
  establish_connection :meteo2017
  self.abstract_class = true
end
