class OtherObservation < ApplicationRecord
  after_initialize :init
  audited
  OTHER_TYPES = {
    'temp' => "Температура на 8 часов",
    'temp16' => "Температура на 16 часов",
    'perc' => "Осадки",
    'min_hum' => "Минимальная влажность",
    'freezing' => "Критическая температура вымерзания",
    'wind' => 'Порывы ветра'
  }
  POSTS = ['Авдотьино', 'Кировский', 'Макеевка', 'Старобешево', 'Тельманово', 
    'Раздольное', 'Стрюково', 'Дмитровка', 'Новоселовка', 'Благодатное', 'Алексеево-Орловка']
  def self.last_50_telegrams(data_type)
    if data_type == 'wind'
      OtherObservation.where('data_type = ?', data_type).limit(50).order(:obs_date, :period).reverse_order
    else
      OtherObservation.where('data_type = ?', data_type).limit(100).order(:obs_date, :updated_at).reverse_order
    end
  end
  def init
    data_type  ||= 'temp'
  end

  def self.wind_gusts(report_date)
    prev_day = (report_date-1.day).strftime("%Y-%m-%d")
    rows = OtherObservation.select("station_id, ROUND(max(value)) max_value").
      where("data_type='wind' and station_id in (1,2,3,10) and obs_date = ?", prev_day).group(:station_id)
    ret = []
    rows.each {|w_g| ret[w_g['station_id']] = w_g['max_value']}
    ret
  end
end
