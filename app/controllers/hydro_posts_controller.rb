class HydroPostsController < ApplicationController
  before_action :cors_preflight_check

  def cors_preflight_check
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  end
  def index
    @hydro_posts = HydroPost.all.order(:id)
    respond_to do |format|
      format.html
      format.json do
        render json: {hydroposts: @hydro_posts}
      end
    end
  end
#  def index
#    @hydro_posts = HydroPost.all.order(:id)
#  end  
end
