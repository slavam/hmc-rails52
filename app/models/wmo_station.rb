class WmoStation < ApplicationRecord
  def self.wmo_stations
    stations = self.all
    ret = {}
    stations.each {|s| ret[s.code] = {latitude: s.latitude, longitude: s.longitude, name: s.name} }
    ret
  end
  def self.active_station_codes(set_stations)
    if set_stations == 'set2500'
      field = 'is_active_2500'
    elsif set_stations == 'set5000'
      field = 'is_active_5000'
    else
      field = 'is_active'
    end
    stations = self.where(field+' = true').order(:code)
    ret = []
    stations.each {|s| ret << s.code }
    ret
  end
end
