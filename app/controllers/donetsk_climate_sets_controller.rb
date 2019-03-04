class DonetskClimateSetsController < ApplicationController
  before_action :find_donetsk_climate_set, only: [:edit, :update] 
  def index
    @donetsk_climate_sets = DonetskClimateSet.all.order(:mm, :dd)
  end
  def new
    @donetsk_climate_set = DonetskClimateSet.new
    @donetsk_climate_set.mm = 1
    @donetsk_climate_set.dd = 1
  end
  
  def create
    @donetsk_climate_set = DonetskClimateSet.new(donetsk_climate_set_params)
    if @donetsk_climate_set.save
      flash[:success] = "Создан набор данных"
      redirect_to donetsk_climate_sets_path
    else
      render 'new'
    end
  end
  
  def edit
  end
  
  def update
    if not @donetsk_climate_set.update_attributes donetsk_climate_set_params
      render :action => :edit
    else
      flash[:success] = "Набор изменен"
      redirect_to donetsk_climate_sets_path
    end
  end
  private
    def find_donetsk_climate_set
      @donetsk_climate_set = DonetskClimateSet.find(params[:id])
    end
    def donetsk_climate_set_params
      params.require(:donetsk_climate_set).permit(:mm, :dd, :t_avg, :t_max, :year_max, :t_min, :year_min)
    end
end
