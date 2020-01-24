class Playday < ApplicationRecord
  def self.get_playdays(year, month)
    days = self.select(:pd_day).where(pd_year: year, pd_month: month).order(:pd_day)
    ret = []
    days.each {|d| ret << d.pd_day}
    ret
  end
end
