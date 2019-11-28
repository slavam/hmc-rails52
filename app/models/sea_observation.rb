class SeaObservation < ApplicationRecord
  belongs_to :station
  audited
  
  def self.short_last_50_telegrams(user)
    if user.role == 'specialist'
      all_fields = SeaObservation.where("station_id = ?", user.station_id).limit(50).order(:date_dev, :updated_at).reverse_order
    else
      # all_fields = SeaObservation.all.limit(50).order(:date_dev, :updated_at).reverse_order
      all_fields = SeaObservation.all.limit(50).order(:date_dev, :term).reverse_order
    end
    stations = Station.all.order(:id)
    all_fields.map do |rec|
      {id: rec.id, date: rec.date_dev, station_name: stations[rec.station_id-1].name, telegram: rec.telegram}
    end
  end
  def self.sea_level(report_date)
    s_o = self.where("station_id=10 and term=9 and date_dev like ?","#{report_date}%")
    short_telegram = s_o.present? ? s_o[0].telegram[16..-1] : nil # пропустить группу ветра
    if short_telegram.present?
      g3 = short_telegram =~ / 3[3489].../
      return g3.present? ? short_telegram[g3+3,3] : nil
    else
      return nil
    end
  end
  def self.water_temperature(report_date)
    # (report_date-3.hours).strftime("%Y-%m-%d %H:%M:%S") 2019-05-16 
    s_o = self.where("station_id=10 and term=9 and date_dev like ?","#{report_date}%")[0]
    if s_o.present?
      return s_o.telegram[22] == '5' ? ('-'+s_o.telegram[23]+'.'+s_o.telegram[24]).to_f : (s_o.telegram[22,2]+'.'+s_o.telegram[24]).to_f
    else
      return nil
    end
  end
end
