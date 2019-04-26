class OtherObservation < ApplicationRecord
  audited
  def self.last_50_telegrams(data_type)
    OtherObservation.where('data_type = ?', data_type).limit(50).order(:obs_date, :updated_at).reverse_order
    # OtherObservation.find_by(data_type: data_type).limit(50).order(:obs_date, :updated_at).reverse_order
  end
end
