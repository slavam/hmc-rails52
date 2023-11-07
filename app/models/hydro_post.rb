class HydroPost < ActiveRecord::Base
  has_many :hydro_observations
  def self.hydro_post_names_as_array
    posts = HydroPost.all.order(:id)
    ret = []
    posts.each {|p| ret[p.id] = p.town}
    ret
  end
  def self.hydro_post_names_as_hash
    posts = HydroPost.all
    ret = {}
    posts.each {|p| ret[p.code] = p.town}
    ret
  end
end