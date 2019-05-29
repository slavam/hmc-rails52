class Meteo < ActiveRecord::Base
#  establish_connection :meteo
  establish_connection :meteo2017
  self.abstract_class = true
end
