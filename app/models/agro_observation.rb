class AgroObservation < ActiveRecord::Base
  belongs_to :station
  has_many :crop_conditions, :dependent => :destroy
  has_many :crop_damages, :dependent => :destroy
#  audited
  def self.last_50_telegrams
    AgroObservation.all.limit(50).order(:date_dev, :updated_at).reverse_order
  end

  def self.short_last_50_telegrams(user)
    if user.role == 'specialist'
      all_fields = AgroObservation.where("station_id = ? and date_dev > ?", user.station_id, Time.now.utc-45.days).order(:date_dev, :updated_at).reverse_order
    else
      all_fields = AgroObservation.all.limit(50).order(:date_dev, :updated_at).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
        {id: rec.id, date: rec.date_dev, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
      end
  end

  # def precipitation_to_s(value)
  #   case value
  #     when 0
  #       "Осадков не было"
  #     when 1..988
  #       value.to_s
  #     when 989
  #       "989 и больше"
  #     when 990
  #       "Следы осадков"
  #     when 991..999
  #       ((value - 990)*0.1).round(2).to_s
  #   end
  # end

  def percipitation_type_to_s
    case self.percipitation_type
      when 1
        "Обложной дождь"
      when 2
        "Ливневой дождь"
      when 3
        "Морось"
      when 4
        "Град"
      when 5
        "Снег"
    end
  end

  def dew_intensity_to_s(value)
    if value == 0
      return "Слабая"
    elsif value == 1
      return "Умеренная"
    elsif value == 2
      return "Сильная"
    else
      return ''
    end
  end

  def state_top_layer_soil_to_s
    case self.state_top_layer_soil
      when 0
        "Покрыт снегом"
      when 1
        "Переувлажненный. Текучий"
      when 2
        "Сильно увлажненный. Липкий"
      when 3
        "Хорошо увлажненный. Мягкопластичный"
      when 4
        "Слабо увлажненный. Твердопластичный"
      when 5
        "Сухой. Твердый или сыпучий"
      when 6
        "Мерзлый. Смерзшийся"
    end
  end
  def self.temperature_avg_24(date)
    ret = []
    self.where('date_dev LIKE ?', "#{date}%").select(:station_id, :temperature_avg_24).each{|tm| ret[tm.station_id] = tm.temperature_avg_24}
    ret
  end
  def self.relative_humidity_min_24(date)
    ret = []
    self.where('date_dev LIKE ?', "#{date}%").select(:station_id, :relative_humidity_min_24).each{|tm| ret[tm.station_id] = tm.relative_humidity_min_24}
    ret
  end
  def self.temperature_min_soil_24(date)
    ret = []
    self.where('date_dev LIKE ?', "#{date}%").select(:station_id, :temperature_min_soil_24).each{|tm| ret[tm.station_id] = tm.temperature_min_soil_24}
    ret
  end
  def self.wind_speed_max_24(date)
    ret = []
    self.where('date_dev LIKE ?', "#{date}%").select(:station_id, :wind_speed_max_24).each{|tm| ret[tm.station_id] = tm.wind_speed_max_24}
    ret
  end
  def self.depth_freezing(date)
    ret = []
    self.where('date_dev LIKE ?', "#{date}%").select(:station_id, :telegram).each do |tm|
      i = tm.telegram =~ / 924\d\d 95\d{3} 4/
      if i.present?
        val = tm.telegram[i+14,3].to_i
        ret[tm.station_id] = val if val > 0 # 20200204 KMA
      end
    end
    ret
  end
  def self.radiations(report_date, bulletin_type)
    ret = []
    if bulletin_type == 'radiation'
      additional_ids = ''
    else
      additional_ids = '4,'
    end
    self.where("station_id IN (1,2,3,#{additional_ids}10) AND date_dev LIKE ?", "#{report_date}%").select(:station_id, :telegram).each do |tm|
      i = tm.telegram =~ / \/\/\/\d\d/
      if i.present?
        ret[tm.station_id] = tm.telegram[i+4,2].to_i
      end
    end
    # Sedovo move to bulletins_controller 20190604
    # r_o = RadiationObservation.find_by(date_observation: report_date, hour_observation: 0, station_id: 10)
    # if r_o.present?
      # ret[10] = r_o.telegram[20,3].to_i
    # end
    ret
  end
end
