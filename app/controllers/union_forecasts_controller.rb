class UnionForecastsController < ApplicationController
  before_action :find_union_forecast, :only => [:union_forecast_show, :destroy, :edit, :update]
  
  def index
    @union_forecasts = UnionForecast.paginate(page: params[:page], per_page: 20).order(:report_date).reverse_order
  end
  
  def union_forecast_show
    pdf = Union.new(@union_forecast)
    pdf_file_name = "Union_forecast_#{current_user.id}.pdf"
    respond_to do |format|
      format.pdf do
        send_data pdf.render, filename: pdf_file_name, type: "application/pdf", disposition: "inline", force_download: true, page_size: "A4"
      end
    end
  end
  
  def new
    @union_forecast = UnionForecast.new
    @union_forecast.report_date = Time.now
    @union_forecast.curr_number = Date.today.yday()
  end

  def create
    @union_forecast = UnionForecast.new(union_forecast_params)
    if @union_forecast.save
      flash[:success] = "Прогноз создан"
      redirect_to union_forecasts_path
    else
      render :new
    end
  end
  
  def edit
  end

  def update
    if not @union_forecast.update_attributes union_forecast_params
      render :edit
    else
      flash[:success] = "Прогноз изменен"
      redirect_to union_forecasts_path
    end
  end

  def destroy
    @union_forecast.destroy
    flash[:success] = "Прогноз удален"
    redirect_to union_forecasts_path
  end
  
  private
  
    def find_union_forecast
      @union_forecast = UnionForecast.find(params[:id])
    end
    
    def union_forecast_params
      params.require(:union_forecast).permit(:report_date, :curr_number, :synoptic_situation,
        :forecast_north, :north1_tn, :north1_td, :north2_tn, :north2_td, :north3_tn,
        :north3_td, :forecast_west, :west1_tn, :west1_td, :west2_tn, :west2_td, :west3_tn,
        :west3_td, :forecast_south, :south1_tn, :south1_td, :south2_tn, :south2_td,
        :south3_tn, :south3_td, :forecast_east, :east1_tn, :east1_td, :east2_tn,
        :east2_td, :east3_tn, :east3_td, :forecast_capital, :capital_tn, :capital_td,
        :capital_pd, :capital_pn, :capital_humidity, :chief, :synoptic)
    end
end
