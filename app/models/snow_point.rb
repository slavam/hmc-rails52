class SnowPoint < ApplicationRecord
  def self.actual
    self.where("is_active = true").order(:id)
  end
end
