class PlaydaysController < ApplicationController
  def index
    @playdays = Playday.paginate(page: params[:page], per_page: 20).order(:pd_year, :pd_month, :pd_day)
  end
  
  def new
    @playday = Playday.new
  end
  
  def create
    @playday = Playday.new(pd_year: params[:playday][:year], pd_month: params[:playday][:month], pd_day: params[:playday][:day], description: params[:playday][:description])
    if @playday.save
      flash[:success] = "Добавлен праздничный/нерабочий день"
      redirect_to playdays_path
    else
      render 'new'
    end
  end  
  
  def destroy
    @playday = Playday.find(params[:id])
    @playday.destroy
    flash[:success] = "День удален"
    redirect_to playdays_path
  end
  
  # private
  #   def playday_params
  #     params.require(:playday).permit(:pd_year, :pd_month, :pd_day, :description)
  #   end
end
