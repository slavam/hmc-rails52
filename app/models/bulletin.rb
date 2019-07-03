class Bulletin < ActiveRecord::Base
  HEAD = "МЧС ДНР
        ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР
        МИНИСТЕРСТВА ПО ДЕЛАМ ГРАЖДАНСКОЙ ОБОРОНЫ, ЧРЕЗВЫЧАЙНЫМ
        СИТУАЦИЯМ И ЛИКВИДАЦИИ ПОСЛЕДСТВИЙ СТИХИЙНЫХ БЕДСТВИЙ
        ДОНЕЦКОЙ НАРОДНОЙ РЕСПУБЛИКИ
        (ГИДРОМЕТЦЕНТР МЧС ДНР)"
  ADDRESS = "ул. Любавина, 2, г. Донецк, 83015
        телефон: (062) 303-10-34, телефон/факс: (062) 304-99-25, 
        e-mail: gidromet@mail.dnmchs.ru"
  MONTH_NAME2 = %w{nil января февраля марта апреля мая июня июля августа сентября октября ноября декабря}
  TV_CITIES = ["Артемовск", "Славянск", "Красный Лиман", "Горловка", "Доброполье", "Константиновка", "Красноармейск", "Донецк", "Ясиноватая", "Макеевка", "Снежное", "Шахтерск", "Амвросиевка", "Волноваха", "Марьинка", "Старобешево", "Тельманово", "Мариуполь", "Новоазовск"]
  RADIO_CITIES = ["Донецк", "Горловка", "Дебальцево", "Ясиноватая", "Макеевка", "Снежное", "Шахтерск", "Амвросиевка", "Старобешево", "Тельманово", "Новоазовск"]
  BULLETIN_TYPES = {
    'daily' => "Бюллетени ежедневные", 
    'sea' => "Бюллетени морские", 
    'holiday' => "Бюллетени выходного дня", 
    'storm' => "Штормовые предупреждения", 
    'sea_storm' => "Шторма на море", 
    'radiation' => "Радиация", 
    # 'tv' => "Телевидение", 
    'radio' => 'Радио', 
    'avtodor' => "АВТОДОР",
    'dte' => "Донбасстеплоэнерго"
  }
  CHIEFS = {"Лукьяненко" => "М.Б. Лукьяненко", "Стец" => "Н.В. Стец"}
  RESPONSIBLES = {"Бойко" => "Л.Н. Бойко", "Кияненко" => "М.А. Кияненко"}

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
    synoptics = ["Деревянко Н.Н.", "Маренкова Н.В.", "Осокина Л.Н.", "Соколова Т.Е.", "Щербак Е.Д.", "Томченко Т.В.", "Нифтуллаева О.В."]
    res = []
    synoptics.each {|s| res << [s, s]}
    return res
  end
  
  def date_hour_minute
    report_date = self.report_date.to_s
    "#{report_date[8,2]}.#{report_date[5,2]}.#{report_date[0,4]} г. #{self.storm_hour} час. #{self.storm_minute == 0 ? '00' : self.storm_minute} мин."
  end
  
  def chief_2_pdf
    ret = {}
    if self.chief == "М.Б. Лукьяненко"
      ret[:position] = "Начальник"
      ret[:image_name] = "./app/assets/images/chief.png"
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
      ret[:position] = "Начальник отдела гидрометеорологического обеспечения и обслуживания"
      ret[:image_name] = "./app/assets/images/head_of_dep.png"
      ret[:full_name] = "Бойко Любовь Николаевна"
    else
      ret[:position] = "Врио начальника отдела гидрометеорологического обеспечения и обслуживания"
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
end