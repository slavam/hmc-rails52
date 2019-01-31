class HydroObservation < ApplicationRecord
  belongs_to :hydro_post
  
  def self.short_last_50_telegrams(user)
    all_fields = HydroObservation.all.limit(50).order(:date_observation, :updated_at).reverse_order
    hydro_posts = HydroPost.all.order(:id)
    all_fields.map do |rec|
      {id: rec.id, date: rec.date_observation, station_name: hydro_posts[rec.hydro_post_id-1].town, telegram: rec.telegram}
    end
  end
  def water_level(value)
    if value>5000
      return -(value-5000)
    else
      return value
    end
  end
  def change_level(value, direct)
    if direct == '0'
      return 'Уровень не изменился'
    else
      return direct == '1' ? "Рост уровня +#{value}" : "Спад уровня -#{value}"
    end
  end
end