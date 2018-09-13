class RadiationObservation < ApplicationRecord
  belongs_to :station
  audited
  
  def self.short_last_50_telegrams(user)
    if user.role == 'specialist'
      all_fields = RadiationObservation.where("station_id = ?", user.station_id).limit(50).order(:date_observation, :updated_at).reverse_order
    else
      all_fields = RadiationObservation.all.limit(50).order(:date_observation, :updated_at).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
      {id: rec.id, date: rec.date_observation, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end
end
