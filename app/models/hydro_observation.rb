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
  LONGTERM_LEVEL_AVG = [ [],
    [nil,135,135,139,137,134,137,134,129,130,132,132,133], # Donetsk                
    [nil, 60, 63, 64, 63, 69, 68, 57, 51, 53, 58, 61, 60], # Razdolnoe
    [nil,118,123,131,128,121,116,112,108,108,112,113,116], # Strukovo
    [nil,388,415,445,434,397,369,353,337,338,344,345,366], # Dmitrovka
    [nil,239,242,250,246,238,235,232,230,231,233,235,236], # Novoselovka
    [nil,142,153,145,133,123,115,108,100,104,115,119,128], # Blagodatnoe
    [nil,138,141,147,145,140,138,133,128,128,130,130,132]  # Alexeevo-Orlovka
  ]
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
