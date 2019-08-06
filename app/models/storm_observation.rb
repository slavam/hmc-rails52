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
      # all_fields = StormObservation.all.limit(50).order(:telegram_date, :updated_at).reverse_order # 20190604 согласовано с Х.Е.
      all_fields = StormObservation.all.limit(50).order(:created_at, :updated_at).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
      # {id: rec.id, date: rec.telegram_date, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
      {id: rec.id, date: rec.created_at, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end
  
  def event_time
    self.hour_event.to_s.rjust(2, '0')+':'+self.minute_event.to_s.rjust(2, '0')
  end
  
  def code_warep (code_warep_pos = 26)
    self.telegram[code_warep_pos,2].to_i
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
      when 50
        "Гололед"
      when 51
        "Сложные отложения"
      when 52
        "Налипание мокрого снега"
      when 61
        "Сильный дождь"
      when 65
        "Очень сильный дождь"
      when 71
        "Сильный снег, мокрый снег, количество осадков >= 7 мм, продолжительность <= 12 часов"
      when 91
        "Гроза"
    end
  end
  
  def precipitation_type(code)
    pt = [
      '','','','','','','','','','9',
      '','','','','','','',"Осадки на станции отсутствуют",'',"Осадки на станции отсутствуют",
      '','','','','','','','','','29',
      '','','','','','','','','','39',
      '','','','','','','','','','49',
      '','','','','','','','','','59',
      '','','','','','','','','','69',
      '','','','','','','','','','79',
      'Ливневой дождь слабый','','','','','','','','','89',
      '','','','','','','','','','99',
      ]
    pt[code]
    # case code
    #   when 17, 19
    #     "Осадки на станции отсутствуют"
    # end
  end
  
  def weather_in_term(code)
    wit = [
      '0','','','','','','','','','9',
      'На станции дымка (видимость >= 1 км)','','','','','','','','','19',
      '','','','','','','','','','29',
      '','','','','','','','','','39',
      '','','','','','','','Туман на станции начался/усилился, неба не видно','','49',
      '','','Налипание мокрого снега','','','','','','','59',
      '','','','','','','','','','69',
      '','','','Снег умеренный непрерывный','Снег сильный с перерывами','','','','','79',
      '','','','','','','','','','89',
      '','','','','','','','','','99'
      ]
    wit[code]
  end
  
  def clouds_form(c_f)
    return 'Не определена' if c_f.nil?
    cloud_form = ['Перистые', 'Перисто-кучевые', 'Перисто-слоистые', 'Высококучевые', 'Высокослоистые', 'Слоисто-дождевые', 'Слоисто-кучевые', 'Слоистые', 'Кучевые', 'Кучево-дождевые']
    cloud_form[c_f]
  end
  
  def clouds_height(c_h)
    case c_h
      when 0
        "Менее 30"
      when 1..50
        "#{c_h * 30}"
      when 56..59
        "#{(c_h - 50) * 300}"
      when 60..79
        "#{(c_h - 60) * 300 + 3000}"
      when 80..88
        "#{(c_h - 80) * 1500 + 9000}"
      when 89
        "Более 21000"
      when 90
        "Менее 50"
      when 91
        "50-100"
      when 92
        "100-200"
      when 93
        "200-300"
      when 94
        "300-600"
      when 95
        "600-1000"
      when 96
        "1000-1500"
      when 97
        "1500-2000"
      when 98
        "2000-2500"
      when 99
        "Более 2500"
    end
  end
  
  def diameter_hail(d_h)
    case d_h
      when 0..55
        "#{d_h}"
      when 56..90
        "#{(d_h - 50) * 10}"
      when 91..96
        "#{((d_h - 90) * 0.1).round(1)}"
      when 97
        "Менее 0.1"
      when 98
        "Более 400"
      when 99
        "Измерение невозможно"
    end
  end
end
