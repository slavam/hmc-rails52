class Station < ActiveRecord::Base
  has_many :synoptic_observations
  def self.station_id_by_code
    stations = Station.all.order(:id)
    ret = {}
    stations.each { |s| ret[s.code] = s.id }
    ret
  end
  
  def self.stations_array_with_any
    stations = Station.all.order(:id)
    return [Station.new(id: 0, code: 0, name: 'Все')] + stations.to_a
  end
  def self.name_stations_as_array
    stations = Station.all.order(:id)
    ret = []
    stations.each {|s| ret[s.id] = s.name}
    ret
  end
end