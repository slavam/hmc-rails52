class OtherObservation < ApplicationRecord
  after_initialize :init
  # audited 20220217 mwm for wind direction archive
  OTHER_TYPES = {
    'temp' => "Температура на 8 часов",
    'temp16' => "Температура на 16 часов",
    'perc' => "Осадки",
    'min_hum' => "Минимальная влажность",
    'freezing' => "Критическая температура вымерзания",
    'wind' => 'Порывы ветра',
    'duty' => 'Дежурные',
    'duty_synoptic' => 'Дежурные синоптики'
  }
  POSTS = [
    'Авдотьино',          #83028
    'Кировский',          #
    'Макеевка',           #
    'Старобешево',        #
    'Тельманово',         #
    'Раздольное',         #83035
    'Стрюково',           #83056
    'Дмитровка',          #83060
    'Новоселовка',        #83068
    'Благодатное',        #83074
    'Алексеево-Орловка',  #83083
    'Николаевка']
    # // {value: 'Николаевка', label: 'Николаевка'},
    #   // {value: 'Кременевка', label: 'Кременевка'},
    #   // {value: 'Захаровка', label: 'Захаровка'},
    #   // {value: 'Стародубовка', label: 'Стародубовка'},
    #   // {value: 'Алексеево-Дружковка', label: 'Алексеево-Дружковка'},
    #   // {value: 'Черкасское', label: 'Черкасское'},
    #   // {value: 'Северск', label: 'Северск'},
    #   // {value: 'Торское', label: 'Торское'},
  def self.last_50_telegrams(data_type)
    if data_type == 'wind'
      OtherObservation.where('data_type = ?', data_type).limit(50).order(:obs_date, :period).reverse_order
    else
      OtherObservation.where('data_type = ?', data_type).limit(400).order(:obs_date, :updated_at).reverse_order
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
