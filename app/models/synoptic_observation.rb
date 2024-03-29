class SynopticObservation < ActiveRecord::Base
  validates :date, presence: true
  validates :term, presence: true
  validates :station_id, presence: true
  validates :telegram, presence: true
  belongs_to :station
  audited
  SOIL_CONDITION=['Сухая','Влажная (без луж)','Влажная (с лужами)','Затоплена водой','Замерзшая','Покрыта льдом','Покрыта сухой пылью','Покрыта сухой пылью полностью (тонкий слой)','Покрыта сухой пылью полностью (умеренный или толстый слой)','Сухая чрезвычайно']
  CLOUD_FORM = ['Перистые','Перисто-кучевые','Перисто-слоистые',"Высококучевые","Высокослоистые","Слоисто-дождевые","Слоисто-кучевые","Слоистые","Кучевые","Кучево-дождевые"]
  CLOUD_HEIGHT = ["< 50","50-100","100-200","200-300","300-600","600-1000","1000-1500","1500-2000","2000-2500","> 2500 или облаков нет"]
  CLOUD_AMOUNT=["0 (облаков нет)",'<=1 (но не 0)','2-3','4','5','6','7-8','>= 9 (но не 10, есть просветы)','10 (без просветов)','Определить невозможно (затруднена видимость)']
  WEATHER_IN_TERM = [
        "Изменение количества облаков в последний час неизвестно", #0
        "Количество облаков в последний час уменьшилось", #1
        "Количество облаков в последний час без изменений", #2
        "Количество облаков в последний час увеличилось", #3
        "Ухудшение видимости из-за дыма", #4
        "Мгла", #5
        "Пыль, не поднятая ветром", #6
        "Пыль или песок, поднятые ветром", #7
        "Пыльные/песчаные сильные вихри, но бури нет", #8
        "Пыльная/песчаная буря", #9
        "Дымка", #10
        "Поземный туман клочками, полосами", #11
        "Поземный туман сплошным слоем", #12
        "Зарница", #13
        "Осадки не достигают поверхности земли", #14
        "Осадки вдали от станции", #15
        "Осадки вблизи станции", #16
        "Гроза, но без осадков", #17
        "Шквал(ы)", #18
        "Смерч(и)", #19
        "Морось, снежные зерна", #20
        "Дождь (незамерзающий)", #21
        "Снег", #22
        "Дождь со снегом, ледяной дождь", #23
        "Морось, дождь замерзающие, образующие гололед", #24
        "Ливневый дождь", #25
        "Ливневый дождь со снегом или снег", #26
        "Град, крупа - с дождем или без дождя", #27
        "Туман или ледяной туман", #28
        "Гроза - сосадками или без них", #29
        "Пыльная или песчаная буря а)слабая или умеренная; б)ослабела", #30
        "Пыльная или песчаная буря а)слабая или умеренная; б)без изменения", #31
        "Пыльная или песчаная буря а)слабая или умеренная; б)началась или усилилась", #32
        "Пыльная или песчаная буря а)сильная; б)ослабела", #33
        "Пыльная или песчаная буря а)сильная; б)без изменения", #34
        "Пыльная или песчаная буря а)сильная; б)началась или усилилась", #35
        "Поземок слабый или умеренный", #36
        "Поземок сильный", #37
        "Метель низовая или общая слабая или умеренная", #38
        "Метель низовая или общая сильная", #39
        "Тумана или ледяного тумана не было", #40
        "Туман или ледяной туман а)не было; б)местами", #41
        "Туман или ледяной туман а)ослабел; б)небо видно", #42
        "Туман или ледяной туман а)ослабел; б)неба не видно", #43
        "Туман или ледяной туман а)без изменения; б)небо видно", #44
        "Туман или ледяной туман а)без изменения; б)неба не видно", #45
        "Туман или ледяной туман а)начался или усилился; б)небо видно", #46
        "Туман или ледяной туман а)начался или усилился; б)неба не видно", #47
        "Туман или ледяной туман; небо видно", #48
        "Туман или ледяной туман; неба не видно", #49
        "Морось слабая с перерывами", #50
        "Морось слабая непрерывная", #51
        "Морось умеренная с перерывами", #52
        "Морось умеренная непрерывная", #53
        "Морось сильная с перерывами", #54
        "Морось сильная непрерывная", #55
        "Морось замерзающая, образующая гололед слабая", #56
        "Морось замерзающая, образующая гололед умеренная или сильная", #57
        "Морось с дождем слабая", #58
        "Морось с дождем умеренная или сильная", #59
        "Дождь слабый с перерывами", #60
        "Дождь слабый непрерывный", #61
        "Дождь умеренный с перерывами", #62
        "Дождь умеренный непрерывный", #63
        "Дождь сильный с перерывами", #64
        "Дождь сильный непрерывный", #65
        "Дождь замерзающий, образующий гололед, слабый", #66
        "Дождь замерзающий, образующий гололед, умеренный или сильный", #67
        "Дождь со снегом или морось со снегом слабые", #68
        "Дождь со снегом или морось со снегом умеренные или сильные", #69
        "Снег слабый с перерывами", #70
        "Снег слабый непрерывный", #71
        "Снег умеренный с перерывами", #72
        "Снег умеренный непрерывный", #73
        "Снег сильный с перерывами", #74
        "Снег сильный непрерывный", #75
        "Снег с туманом или без тумана, ледяные иглы", #76
        "Снег с туманом или без тумана, снежные зерна", #77
        "Снег с туманом или без тумана, звездочки", #78
        "Ледяной дождь", #79
        "Ливневой дождь слабый", #80
        "Ливневой дождь умеренный или сильный", #81
        "Ливневой дождь очень сильный", #82
        "Ливневой дождь со снегом слабый", #83
        "Ливневой дождь со снегом умеренный или сильный", #84
        "Ливневой снег слабый", #85
        "Ливневой снег умеренный или сильный", #86
        "Снежная или ледяная крупа слабая", #87
        "Снежная или ледяная крупа умеренная или сильная", #88
        "Град слабый", #89
        "Град умеренный или сильный", #90
        "Гроза, дождь слабый", #91
        "Гроза, дождь умеренный или сильный", #92
        "Гроза, дождь со снегом, снег слабые", #93
        "Гроза, град, крупа, дождь со снегом умеренные или сильные", #94
        "Гроза слабая или умеренная, дождь, дождь со снегом, снег", #95
        "Гроза слабая или умеренная, град, крупа", #96
        "Гроза сильная, дождь, дождь со снегом, снег", #97
        "Гроза, пыльная или песчаная буря", #98
        "Гроза сильная, град, крупа" #99
    ]
  WEATHER_PAST = [
    "Количество облаков <= 5 баллов, ясно", #0
    "Количество облаков изменилось от <= 5 баллов до > 5 баллов", #1
    "Количество облаков > 5 баллов, пасмурно", #2
    "Буря песчаная или пыльная. Метель", #3
    "Туман или ледяной туман. Мгла", #4
    "Морось", #5
    "Дождь", #6
    "Дождь со снегом. Снег", #7
    "Ливневые осадки", #8
    "Гроза с осадками или без них", #9
    ]
    SURFACE_CONDITION = [
      "Лед" , #0
      "Снег мокрый или слежавшийся 1-4 балла" , #1
      "Снег мокрый или слежавшийся 5-9 баллов" , #2
      "Снег мокрый или слежавшийся 10 баллов; равномерный слой" , #3
      "Снег мокрый или слежавшийся 10 баллов; неравномерный слой" , #4
      "Сухой рассыпчатый снег 1-4 балла" , #5
      "Сухой рассыпчатый снег 5-9 баллов" , #6
      "Сухой рассыпчатый снег 10 баллов; равномерный слой" , #7
      "Сухой рассыпчатый снег 10 баллов; неравномерный слой" , #8
      "Снег с сильными заметами и заносами"  #9
      ]

  def self.last_50_telegrams
    SynopticObservation.all.limit(50).order(:date, :term, :updated_at).reverse_order
  end

  def self.short_last_50_telegrams(user)
    if user.role == 'specialist'
      all_fields = SynopticObservation.where("station_id = ? and observed_at > ?", user.station_id, Time.now.utc-45.days).order(:date, :term, :updated_at).reverse_order
    else
      all_fields = SynopticObservation.all.limit(50).order(:date, :term, :updated_at).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
      {id: rec.id, date: rec.observed_at, term: rec.term, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end

  def wind_direction_to_s
    case self.wind_direction
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

  def visibility
    return "Видимость не определена" if self.visibility_range.nil?
    case self.visibility_range
      when 0
        "< 0,1 км"
      when 1..50
        "до 5 км"
      when 56..80
        "от 6 км до 30 км"
      when 81..88
        "от 35 км до 70 км"
      when 89
        "> 70 км"
      when 90
        " менее 50 м"
      when 91
        " 50 м"
      when 92
        " 200 м"
      when 93
        " 500 м"
      when 94
        " 1 км"
      when 95
        " 2 км"
      when 96
        " 4 км"
      when 97
        " 10 км"
      when 98
        " 20 км"
      when 99
        " более 50 км"
      else
        self.visibility_range.to_s
    end
  end

  def cloud_base_height_to_s
    return "Нижняя граница не определенна" if self.cloud_base_height.nil?
    return CLOUD_HEIGHT[cloud_base_height]
    # case self.cloud_base_height
    #   when 0
    #     "< 50"
    #   when 1
    #     "50-100"
    #   when 2
    #     "100-200"
    #   when 3
    #     "200-300"
    #   when 4
    #     "300-600"
    #   when 5
    #     "600-1000"
    #   when 6
    #     "1000-1500"
    #   when 7
    #     "1500-2000"
    #   when 8
    #     "2000-2500"
    #   when 9
    #     "> 2500 или облаков нет"
    # end
  end

  def cloud_amount(c_a)
    return 'Определить невозможно или наблюдения не производились' if c_a.nil?
    return CLOUD_AMOUNT[c_a]
    # case c_a
    #   when 0
    #     "0 (облаков нет)"
    #   when 1
    #     '<=1 (но не 0)'
    #   when 2
    #     '2-3'
    #   when 3
    #     '4'
    #   when 4
    #     '5'
    #   when 5
    #     '6'
    #   when 6
    #     '7-8'
    #   when 7
    #     '>= 9 (но не 10, есть просветы)'
    #   when 8
    #     '10 (без просветов)'
    #   when 9
    #     'Определить невозможно (затруднена видимость)'
    # end
  end

  def pressure_tendency_characteristic_to_s
    return '' if self.pressure_tendency_characteristic.nil?
    case self.pressure_tendency_characteristic
      when 0
        "рост, затем падение"
      when 1
        " рост "
      when 2
        " рост "
      when 3
        " рост "
      when 4
        "ровный или неровный ход"
      when 5
        "падение, затем рост"
      when 6
        "падение"
      when 7
        "падение"
      when 8
        "падение"
    end
  end

  def clouds_1_to_s
    return 'Облака CL не видны' if self.clouds_1.nil?
    case self.clouds_1
      when 0
        'Облака CL отсутствуют'
      when 1,2
        'Кучевые'
      when 3,9
        'Кучеводождевые'
      when 4,5
        'Слоистокучевые'
      when 6,7
        'Слоистые'
      when 8
        'Кучевые и слоистокучевые'
    end
  end

  def clouds_2_to_s
    return 'Облака CM не видны' if self.clouds_2.nil?
    case self.clouds_2
      when 0
        'Облака CM отсутствуют'
      when 1
        'Высокослоистые'
      when 2
        'Высокослоистые, слоисто-дождевые'
      when 3,5,6,7,8,9
        'Высококучевые'
    end
  end

  def clouds_3_to_s
    return 'Облака CH не видны' if self.clouds_3.nil?
    case self.clouds_3
      when 0
        'Облака CH отсутствуют'
      when 1..4
        'Перистые'
      when 5..8
        'Перисто-слоистые'
      when 9
        'Перисто-кучевые'
    end
  end

  def soil_surface_condition_1_to_s
    return 'Не определено' if self.soil_surface_condition_1.nil?
    return SOIL_CONDITION[soil_surface_condition_1]
    # case self.soil_surface_condition_1
    #   when 0
    #     'Сухая'
    #   when 1
    #     'Влажная (без луж)'
    #   when 2
    #     'Влажная (с лужами)'
    #   when 3
    #     'Затоплена водой'
    #   when 4
    #     'Замерзшая'
    #   when 5
    #     'Покрыта льдом'
    #   when 6
    #     'Покрыта сухой пылью'
    #   when 7
    #     'Покрыта сухой пылью полностью (тонкий слой)'
    #   when 8
    #     'Покрыта сухой пылью полностью (умеренный или толстый слой)'
    #   when 9
    #     'Сухая чрезвычайно'
    # end
  end

  def precipitation_to_s(value)
    case value
      when 0
        "Осадков не было"
      when 1..988
        value.to_s
      when 989
        "989 и больше"
      when 990
        "Следы осадков"
      when 991..999
        ((value - 990)*0.1).round(2).to_s
    end
  end

  def precipitation_time_range_to_s(value)
    time_range = ['', '6', '12', '18', '24', '1', '2', '3', '9', '15']
    time_range[value]
  end

  def snow_cover_height_to_s
    case self.snow_cover_height
      when 1..996
        self.snow_cover_height.to_s
      when 997
        '<0.5'
      when 998
        "Снежный покров отсутствует"
      when 999
        "Измерить невозможно"
    end
  end

  def clouds_form_to_s
    return 'Не определена' if self.cloud_form.nil?
    return CLOUD_FORM[cloud_form]
    # case self.cloud_form
    #   when 0
    #     'Перистые'
    #   when 1
    #     'Перисто-кучевые'
    #   when 2
    #     'Перисто-слоистые'
    #   when 3
    #     "Высококучевые"
    #   when 4
    #     "Высокослоистые"
    #   when 5
    #     "Слоисто-дождевые"
    #   when 6
    #     "Слоисто-кучевые"
    #   when 7
    #     "Слоистые"
    #   when 8
    #     "Кучевые"
    #   when 9
    #     "Кучево-дождевые"
    # end
  end

  def soil_surface_condition_2_to_s
    return 'Не определено' if self.soil_surface_condition_2.nil?
    return SOIL_CONDITION[soil_surface_condition_2]
    # case self.cloud_form
    #   when 0
    #     'Сухая'
    #   when 1
    #     'Влажная (без луж)'
    #   when 2
    #     'Влажная (с лужами)'
    #   when 3
    #     'Затоплена водой'
    #   when 4
    #     'Замерзшая'
    #   when 5
    #     'Покрыта льдом'
    #   when 6
    #     'Покрыта пылью или сыпучим песком частично'
    #   when 7
    #     'Покрыта пылью или сыпучим песком полностью - тонкий слой'
    #   when 8
    #     'Покрыта пылью или сыпучим песком полностью - умеренный или толстый слой'
    #   when 9
    #     'Сухая чрезвычайно'
    # end
  end
  def self.max_day_temperatures(date)
    ret = []
    self.where(term: 18, date: date).select(:station_id, :temperature_dey_max).each{|tm| ret[tm.station_id] = tm.temperature_dey_max}
    ret
  end
  def self.min_night_temperatures(date)
    ret = []
    self.where(term: 6, date: date).select(:station_id, :temperature_night_min).each{|tm| ret[tm.station_id] = tm.temperature_night_min}
    ret
  end
  def self.current_temperatures(term, date)
    ret = []
    self.where(term: term, date: date).select(:station_id, :temperature).each{|tm| ret[tm.station_id] = tm.temperature}
    ret
  end
  def self.precipitation(term, date)
    ret = []
    self.where(term: term, date: date).select(:station_id, :precipitation_1).each{|tm| ret[tm.station_id] = tm.precipitation_1}
    ret
  end
  def self.snow_cover_height(date)
    ret = []
    self.where(term: 6, date: date).select(:station_id, :snow_cover_height).each do |tm|
      # ret[tm.station_id] = tm.snow_cover_height<997 ? tm.snow_cover_height : (tm.snow_cover_height == 997 ? '<0.5' : (tm.snow_cover_height==998 ? 'Снежный покров отсутствует':'Измерить невозможно')) if tm.snow_cover_height.present?
      ret[tm.station_id] = tm.snow_cover_height<997 ? tm.snow_cover_height : (tm.snow_cover_height == 997 ? '<0.5' : (tm.snow_cover_height==998 ? '':'Измерить невозможно')) if tm.snow_cover_height.present? # 20190228 Oksana N
    end
    ret
  end
  def title
    ret = ''
    ret += "N: "+cloud_amount(cloud_amount_1)+"; "
    ret += "Ns: "+cloud_amount(cloud_amount_2)+"; " if cloud_amount_2.present?
    ret += "V: #{visibility}; "
    ret += "h: #{cloud_base_height_to_s}; "
    ret += "d: #{wind_direction_to_s}; "
    ret += "f: #{wind_speed_avg}; "
    ret += "T: #{temperature}; "
    ret += "Td: #{temperature_dew_point}; "
    # ret += "P0: #{(pressure_at_station_level/1.334).round(1)}; " if pressure_at_station_level.present? 20190531 O.N.
    ret += "P0: #{(pressure_at_station_level * 0.75).round(1)}; " if pressure_at_station_level.present?
    if pressure_tendency_characteristic.present? and pressure_tendency.present?
      ap = (pressure_tendency_characteristic < 4 ? '+' : (pressure_tendency_characteristic == 4 ? '' : '-'))+pressure_tendency.to_s
      ret += "ap: #{ap}; "
    end
    ret += "Hum: #{humidity}%; " if temperature.present? and temperature_dew_point.present?
    ret
  end
  def self.station_daily_local_avg_temp(station_id, date)
    start_time_mark = (date-1.day).strftime("%Y-%m-%d")+' 21'
    stop_time_mark = date.strftime("%Y-%m-%d")+' 21'
    return self.select("avg(temperature) temperature").where("station_id = ? AND observed_at >= ? AND observed_at < ?", station_id, start_time_mark, stop_time_mark)[0].temperature
  end
  def precipitation
    return 0 if precipitation_1.nil?
    # return 0.01 if precipitation_1 == 990
    precipitation_1>989 ? ((precipitation_1-990)*0.1).round(1) : precipitation_1
  end
  def humidity
    return nil if temperature.nil? or temperature_dew_point.nil?
    (100*(Math.exp((17.625*temperature_dew_point)/(243.04+temperature_dew_point))/Math.exp((17.625*temperature)/(243.04+temperature)))).round()
  end
  def self.telegram_present?(wmo_index, observation_date, term)
    station_id = Station.find_by(code: wmo_index).id
    find_by(station_id: station_id, date: observation_date, term: term).present?
  end
end
