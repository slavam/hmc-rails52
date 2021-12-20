class SnowPointsController < ApplicationController
  before_action :require_admin, :only => [:edit, :new]
  before_action :find_snow_point, only: [:edit, :update]
  def index
    @snow_points = SnowPoint.all.order(:id)
  end
  def new
    @snow_point = SnowPoint.new
  end
  
  def create
    @snow_point = SnowPoint.new(snow_point_params)
    if @snow_point.save
      redirect_to snow_points_path
    else
      render :new
    end
  end
  
  def edit
  end
  
  def update
    if not @snow_point.update snow_point_params
      render :action => :edit
    else
      redirect_to snow_points_path
    end
  end
  
  private
    def snow_point_params
      params.require(:snow_point).permit(:name, :code, :snow_point_type, :is_active)
    end
    def find_snow_point
      @snow_point = SnowPoint.find(params[:id])
    end
end
