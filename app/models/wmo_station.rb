class WmoStation < ApplicationRecord
  def self.wmo_stations
    stations = self.all
    ret = {}
    stations.each {|s| ret[s.code] = {latitude: s.latitude, longitude: s.longitude, name: s.name} }
    ret
  end
  def self.active_station_codes
    stations = self.where('is_active = true').order(:code)
    ret = []
    stations.each {|s| ret << s.code }
    ret
  end
end
