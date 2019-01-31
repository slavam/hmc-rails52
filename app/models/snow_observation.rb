class SnowObservation < ApplicationRecord
  belongs_to :snow_point
  
  def self.short_last_50_telegrams(user)
    all_fields = self.all.limit(50).order(:date_observation, :updated_at).reverse_order
    snow_points = SnowPoint.actual
    all_fields.map do |rec|
      {id: rec.id, date: rec.date_observation, station_name: snow_points[rec.snow_point_id-1].name, telegram: rec.telegram}
    end
  end
end
