class WmoStation < ApplicationRecord
  def self.wmo_stations
    stations = self.all
    ret = {}
    stations.each {|s| ret[s.code] = {latitude: s.latitude, longitude: s.longitude, name: s.name} }
    ret
  end
end
