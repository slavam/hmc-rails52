class SnowPoint < ApplicationRecord
  def self.actual
    self.where("is_active = true").order(:id)
  end
  def self.snow_point_names_as_array
    points = SnowPoint.all.order(:id)
    ret = []
    points.each {|p| ret[p.id] = p.name}
    ret
  end
end
