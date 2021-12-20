class MeteoLinksController < ApplicationController
  before_action :find_meteo_link, only: [:edit, :update, :destroy]
  
  def index
    @meteo_links = MeteoLink.where("user_id>0 AND user_menu_id>0").order(:user_id, :user_menu_id, :name)
  end
  
  def new
    @meteo_link = MeteoLink.new
  end
  
  def create
    @meteo_link = MeteoLink.new(meteo_link_params)
    if @meteo_link.save
      flash[:success] = "Ссылка создана"
      redirect_to meteo_links_path
    else
      render 'new'
    end
  end
  
  def edit
  end
  
  def update
    if not @meteo_link.update meteo_link_params
      render :action => :edit
    else
      flash[:success] = "Ссылка изменена"
      redirect_to meteo_links_path
    end
  end
  
  def destroy
    @meteo_link.destroy
    flash[:success] = "Ссылка удалена"
    redirect_to meteo_links_path
  end
  
  private
    def find_meteo_link
      @meteo_link = MeteoLink.find(params[:id])
    end
    
    def meteo_link_params
      params.require(:meteo_link).permit(:name, :address, :is_active, :user_id, :user_menu_id)
    end
end
