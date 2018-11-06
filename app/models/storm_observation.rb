class StormObservation < ActiveRecord::Base
  belongs_to :station
  audited
  
  def self.last_50_telegrams
    StormObservation.all.limit(50).order(:telegram_date, :updated_at).reverse_order
  end
  
  def self.short_last_50_telegrams(user)
    if user.role == 'specialist'
      all_fields = StormObservation.where("station_id = ? and telegram_date > ?", user.station_id, Time.now.utc-45.days).order(:telegram_date, :updated_at).reverse_order
    else
      all_fields = StormObservation.all.limit(50).order(:telegram_date, :updated_at).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
      {id: rec.id, date: rec.telegram_date, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end
  
  def event_time
    self.hour_event.to_s.rjust(2, '0')+':'+self.minute_event.to_s.rjust(2, '0')
  end
  
  def code_warep
    self.telegram[26,2].to_i
  end
  
  def wind_direction_to_s(value)
    case value
      when 0
        "Штиль"
      when 1..2
        "Северо-северо-восточное"
      when 3..5
        "Северо-восточное"
      when 6..7
        "Восточно-северо-восточное"
      when 8..9
        "Восточное"
      when 10..11
        "Восточно-юго-восточное"
      when 12..14
        "Юго-восточное"
      when 15..16
        "Юго-юго-восточное"
      when 17..18
        "Южное"
      when 19..20
        "Юго-юго-западное"
      when 21..23
        "Юго-западное"
      when 24..25
        "Западно-юго-западное"
      when 26..27
        "Западное"
      when 28..29
        "Западно-северо-западное"
      when 30..32
        "Северо-западное"
      when 33..34
        "Северо-северо-западное"
      when 35..36
        "Северное"
      when 99
        "Переменное"
      else
        self.wind_direction.to_s
    end
  end
  
  def code_warep_to_s(code)
    case code
      when 11
        "Ветер (кроме шквала) скорость средняя, максимальная или отдельные порывы >= 12 м/с"
      when 12
        "Сильный ветер, максимальная скорость >= 25 м/с"
      when 17
        "Шквал, максимальная скорость >= 15 м/с"
      when 18
        "Шквал, максимальная скорость >= 25 м/с"
      when 19
        "Смерч"
      when 30
        "Высота нижней границы облаков (низкая облачность)"
      when 40
        "Видимость"
      when 91
        "Гроза"
    end
  end
  
  def precipitation_type(code)
    case code
      when 17, 19
        "Осадки на станции отсутствуют"
    end
  end
end
