class OtherObservation < ApplicationRecord
  after_initialize :init

  # belongs_to :station
  audited
  OTHER_TYPES = {
    'temp' => "Температура на 8 часов",
    'temp16' => "Температура на 16 часов",
    'perc' => "Осадки",
    'min_hum' => "Минимальная влажность",
    'freezing' => "Критическая температура вымерзания"
  }
  def self.last_50_telegrams(data_type)
    OtherObservation.where('data_type = ?', data_type).limit(50).order(:obs_date, :updated_at).reverse_order
  end
  def init
    self.data_type  ||= 'temp'
  end
end
