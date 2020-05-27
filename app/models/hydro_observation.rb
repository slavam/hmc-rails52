class HydroObservation < ApplicationRecord
  belongs_to :hydro_post
  ICE_PHENOMENA = { 13 => 'Забереги',
                    19 => 'Шугоход',
                    39 => 'Закраины',
                    46 => 'Забереги остаточные',
                    63 => 'Ледостав неполный',
                    64 => 'Ледостав с полыньями',
                    65 => 'Ледостав'
                  }
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
  def self.water_level(obs_date)
    rows = self.select(:hydro_post_id, :telegram).where("hydro_type IN ('ЩЭРЕИ','ЩЭРЕХ','ЩЭРЕА') AND date_observation='#{obs_date}' AND hour_obs=8").order(:hydro_post_id)
    ret = []
    rows.each {|wl|
      ret[wl.hydro_post_id] = wl.telegram[19,4].to_i
    }
    ret
  end
end
