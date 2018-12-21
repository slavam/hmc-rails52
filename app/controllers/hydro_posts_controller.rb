class HydroPostsController < ApplicationController
  def index
    @hydro_posts = HydroPost.all.order(:id)
  end  
end
