class FireDanger < ApplicationRecord
  belongs_to :station
  
  def self.last_fire_danger(station_id)
    f_d = self.select(:fire_danger).where(station_id: station_id).order(:observation_date).reverse_order[1] #.first
    return f_d.present? ? f_d : 0
  end
  def self.fire_danger_value(station_id, obs_date)
    f_d = self.find_by(station_id: station_id, observation_date: obs_date )
    return f_d.present? ? f_d.fire_danger : 0
  end
end
