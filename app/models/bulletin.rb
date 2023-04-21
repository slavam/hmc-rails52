class Bulletin < ActiveRecord::Base
  HEAD = 'РОСГИДРОМЕТ
    Федеральное государственное бюджетное учреждение
    "Управление по гидрометеорологии и мониторингу окружающей среды
    по Донецкой Народной Республике"
    (ФГБУ "УГМС по ДНР")'
  HEAD1 = 'РОСГИДРОМЕТ
    Федеральное государственное бюджетное учреждение'
  HEAD2 = '"Управление по гидрометеорологии и мониторингу окружающей среды
    по Донецкой Народной Республике"'
  HEAD3 = '(ФГБУ "УГМС по ДНР")'
  # HEAD = 'МЧС ДНР
  #       ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ
  #       "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР
  #       МИНИСТЕРСТВА ПО ДЕЛАМ ГРАЖДАНСКОЙ ОБОРОНЫ, ЧРЕЗВЫЧАЙНЫМ
  #       СИТУАЦИЯМ И ЛИКВИДАЦИИ ПОСЛЕДСТВИЙ СТИХИЙНЫХ БЕДСТВИЙ
  #       ДОНЕЦКОЙ НАРОДНОЙ РЕСПУБЛИКИ"
  #       (ГБУ "ГИДРОМЕТЦЕНТР МЧС ДНР")'
  ADDRESS = "ул. Любавина, 2, г. Донецк, г.о. Донецкий, ДНР, 283015
        телефон: +7 (856) 303-10-34, +7 (856) 303-10-49
        e-mail: ugms.dnr@mail.ru"
        # e-mail: gidromet@mail.dnmchs.ru"
  ADDRESS2 = "ул. Любавина, 2, г. Донецк, г.о. Донецкий, ДНР, 283015 тел. +7 (856) 311-40-10
        web: www.dnmchs.ru  ОГРН 1229300076015  E-mail: gidromet@mail.dnmchs.ru"
  MONTH_NAME2 = %w{nil января февраля марта апреля мая июня июля августа сентября октября ноября декабря}
  TV_CITIES = ["Артемовск", 
    "Славянск", 
    "Красный Лиман", 
    "Горловка", 
    "Доброполье", 
    "Константиновка", 
    "Красноармейск", 
    "Донецк", 
    "Ясиноватая", 
    "Макеевка", 
    "Снежное", 
    "Шахтерск", 
    "Амвросиевка", 
    "Волноваха", 
    "Марьинка", 
    "Старобешево", 
    "Тельманово", 
    "Мариуполь", 
    "Новоазовск"]
  RADIO_CITIES = ["Донецк", "Горловка", "Дебальцево", "Ясиноватая", "Макеевка", "Снежное", 
    "Шахтерск", "Амвросиевка", "Старобешево", "Тельманово", "Новоазовск"]
  RADIO2_CITIES = [
    "Славянск",
    "Краматорск",
    "Артемовск",
    "Дебальцево", 
    "Горловка", 
    "Красноармейск",
    "Ясиноватая", 
    "Донецк",
    "Макеевка", 
    "Шахтерск",
    "Снежное", 
    "Амвросиевка", 
    "Старобешево", 
    "Волноваха",
    "Тельманово", 
    "Мариуполь",
    "Новоазовск"]
  BULLETIN_TYPES = {
    'daily' => "Бюллетени ежедневные",
    'sea' => "Бюллетени морские",
    'holiday' => "Бюллетени выходного дня",
    'storm' => "Штормовые предупреждения",
    'sea_storm' => "Шторма на море",
    'radiation' => "Радиация",
    'radiation2' => "Радиация 2",
    # 'tv' => "Телевидение",
    'radio' => 'Радио',
    'radio2' => 'Радио 2',
    'avtodor' => "АВТОДОР",
    'dte' => "Донбасстеплоэнерго",
    'gsr' => "ГазСтройРеновация",
    'empire' => "Империя",
    'fire' => "Пожароопасность",
    'clarification' => "Уточнение",
    'bus_station' => "Автовокзалы Донбасса",
    'hydro' => "Бюллетени гидрологические",
    'hydro2' => "Бюллетени гидрологические (вторичные)",
    'alert' => 'Штормовые оповещения (гидро)',
    'warning' => 'Штормовые предупреждения (гидро)',
    'railway' => 'Бюллетени для Железной дороги',
    'rw_storm' => 'Шторма для Железной дороги',
    'fire_storm' => 'Шторма (пожары)'
  }
  # CHIEFS = {"Лукьяненко" => "М.Б. Лукьяненко", "Стец" => "Н.В. Стец", "Арамелева" => "О.В. Арамелева"}
  CHIEFS = {"Кияненко" => "М.А. Кияненко", "Стец" => "Н.В. Стец", "Арамелева" => "О.В. Арамелева"}
  RESPONSIBLES = {"Бойко" => "Л.Н. Бойко", "Кияненко" => "М.А. Кияненко"}
  REGIONS = ["Донецк",
            "Макеевка, Харцызск, Ясиноватая",
            "Горловка, Енакиево, Дебальцево",
            "Шахтерский",
            "Шахтерск, Торез, Снежное",
            "Амвросиевкий",
            "Старобешевский",
            "Докучаевск",
            "Тельмановский",
            "Новоазовский"]
  REGIONS2 = ["Донецк",
            "Макеевка, Харцызск, Ясиноватая",
            "Горловка, Енакиево, Дебальцево",
            "Шахтерский",
            "Шахтерск, Торез, Снежное",
            "Амвросиевкий",
            "Старобешевский",
            "Волновахский",
            "Докучаевск",
            "Тельмановский",
            "Володарский, Новоазовский",
            "Мариуполь, Мангуш"]

  # mount_uploader :picture, PictureUploader
  def pdf_filename(user_id)
    "Bulletin_#{self.bulletin_type}_#{user_id}.pdf"
  end

  def png_filename(user_id)
    "Bulletin_#{self.bulletin_type}_#{user_id}.png"
  end

  def png_page_filename(user_id, page)
    "Bulletin_#{self.bulletin_type}_#{user_id}-#{page}.png"
  end

  def report_date_as_str
    date = self.report_date.to_s(:custom_datetime)
    date[8, 2] + ' ' + MONTH_NAME2[date[5,2].to_i]+ ' ' + date[0,4] + " года"
  end

  def self.synoptic_list
    synoptics = ["Деревянко Н.Н.", "Маренкова Н.В.", "Соколова Т.Е.", "Щербак Е.Д.", "Томченко Т.В.", "Нифтуллаева О.В."]
    res = []
    synoptics.each {|s| res << [s, s]}
    return res
  end

  def date_hour_minute
    report_date = self.report_date.to_s
    "#{report_date[8,2]}.#{report_date[5,2]}.#{report_date[0,4]} г. #{self.storm_hour>9 ? self.storm_hour : '0'+self.storm_hour.to_s} час. #{self.storm_minute>9  ? self.storm_minute : '0'+self.storm_minute.to_s} мин."
  end

  def chief_2_pdf
    ret = {}
    if self.chief == "М.Б. Лукьяненко"
      ret[:position] = "Начальник"
      ret[:image_name] = "./app/assets/images/chief.png"
    elsif self.chief == "М.А. Кияненко"
      ret[:position] = "Начальник Донецкого гидрометцентра"
      # ret[:position] = "Начальник"
      ret[:image_name] = "./app/assets/images/kian.png"
    elsif self.chief == "О.В. Арамелева"
      ret[:position] = "Врио начальника"
      ret[:image_name] = "./app/assets/images/arameleva2.png"
    else
      ret[:position] = "Врио начальника"
      ret[:image_name] = "./app/assets/images/stec.png"
    end
    ret[:name] = self.chief
    ret
  end
  def responsible_2_pdf
    ret = {}
    if self.responsible == "Л.Н. Бойко"
      ret[:position] = "Начальник отдела гидрометеорологического обеспечения" # и обслуживания"
      ret[:image_name] = "./app/assets/images/head_of_dep.png"
      ret[:full_name] = "Бойко Любовь Николаевна"
    else
      ret[:position] = "Врио начальника отдела гидрометеорологического обеспечения" # и обслуживания"
      ret[:image_name] = "./app/assets/images/kian.png"
      ret[:full_name] = "Кияненко Маргарита Анатольевна"
    end
    ret[:name] = self.responsible
    ret
  end
  def self.last_this_type bulletin_type
    Bulletin.where(bulletin_type: bulletin_type).order(:id).reverse_order[0]
  end
  def start_month(d1,d2)
    m1 = (self.report_date + d1).month
    m2 = (self.report_date + d2).month
    return m1 == m2 ? '' : ' '+MONTH_NAME2[(self.report_date+d1).month]
  end
  def header_daily
    curr_year = ((report_date.month == 12) and (report_date.day == 31)) ? " #{report_date.year} года" : ''
    report_date_next = report_date+1.day
    return "на сутки с 21 часа #{'%02d' % report_date.day} #{MONTH_NAME2[report_date.month]}#{curr_year} до 21 часа #{'%02d' % report_date_next.day} #{MONTH_NAME2[report_date_next.month]} #{report_date_next.year} года"
  end
  def header_period
    rd_2 = report_date+2
    rd_3 = report_date+3
    curr_year = rd_2.year == rd_3.year ? '' : " #{rd_2.year} года"
    return "Периодный прогноз погоды на #{'%02d' % rd_2.day}#{start_month(2,3)}#{curr_year} - #{'%02d' % rd_3.day} #{MONTH_NAME2[rd_3.month]} #{rd_3.year} года"
  end
  def header_advice
    rd_4 = report_date + 4.day
    rd_5 = report_date + 5.day
    curr_year = ''
    weather = ' погоды'
    if (rd_4.year != rd_5.year)
      curr_year = " #{rd_4.year} года"
      weather = ''
    end
    return "Консультативный прогноз#{weather} на #{'%02d' % rd_4.day}#{start_month(4,5)}#{curr_year} - #{'%02d' % rd_5.day} #{MONTH_NAME2[rd_5.month]} #{rd_5.year} года"
  end
  def header_orientation
    rd_6 = report_date+6.days
    rd_10 = report_date+10.days
    curr_year = ''
    weather = ' погоды'
    if (rd_6.year != rd_10.year)
      curr_year = " #{rd_6.year} года"
      weather = ''
    end
    return "Ориентировочный прогноз#{weather} на #{'%02d' % rd_6.day}#{start_month(6,10)}#{curr_year} - #{'%02d' % rd_10.day} #{MONTH_NAME2[rd_10.month]} #{rd_10.year} года"
  end
  def header_mdata
    rd_prev = report_date - 1.day
    curr_year = rd_prev.year == report_date.year ? '' : " #{rd_prev.year} года"
    return "за период с 9.00 часов #{'%02d' % rd_prev.day} #{MONTH_NAME2[rd_prev.month]}#{curr_year} до 9.00 часов #{'%02d' % report_date.day} #{MONTH_NAME2[report_date.month]} #{report_date.year} года"
  end
  def header_review
    rs_date = (review_start_date.present? ? review_start_date : report_date-1.day)
    curr_year = rs_date.year == report_date.year ? '' : " #{rs_date.year} года"
    return "за период с 9.00 часов #{'%02d' % rs_date.day} #{MONTH_NAME2[rs_date.month]}#{curr_year} до 9.00 часов #{'%02d' % report_date.day} #{MONTH_NAME2[report_date.month]} #{report_date.year} года"
  end
  def self.ogmo_code
    (Time.now >= '2020-01-01'.to_date)? '7':'3' # KMA 20221103
  end
end
