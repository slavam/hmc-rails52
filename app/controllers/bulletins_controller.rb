class BulletinsController < ApplicationController
  before_action :find_bulletin, :only => [:bulletin_show, :show, :destroy, :print_bulletin, :edit, :update]
  # after_filter :pdf_png_delete, :only => [:holiday_show]
  # def index
  #   @bulletins = Bulletin.all.order(:created_at).reverse_order
  # end
  def bulletins_select
    @tab_titles = ['Бюллетени ежедневные', 'Бюллетени морские', 'Бюллетени выходного дня']
    @bulletins = Bulletin.where(bulletin_type: 'daily').order(:created_at).reverse_order
  end

  def list
    @bulletin_type = params[:bulletin_type] 
    @bulletins = Bulletin.where(bulletin_type: @bulletin_type).order(:created_at).reverse_order
    respond_to do |format|
      format.html 
      format.json do
        render json: {bulletins: @bulletins}
      end
    end
  end
  
  def new_bulletin
    @bulletin = Bulletin.new
    @bulletin.report_date = Time.now.strftime("%Y-%m-%d")
    @bulletin.curr_number = Date.today.yday() #.to_s+'-РС'
    @bulletin.bulletin_type = params[:bulletin_type] 
    bulletin = Bulletin.last_this_type params[:bulletin_type]
    case params[:bulletin_type]
      when 'radio', 'radiation'
        @bulletin.meteo_data = bulletin.meteo_data if bulletin.present?
      when 'avtodor', 'storm', 'sea_storm'
        @bulletin.curr_number = '' if params[:bulletin_type] != 'avtodor'
        @bulletin.meteo_data = bulletin.meteo_data
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.storm = bulletin.storm
      when 'holiday'
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.storm = bulletin.storm
        @bulletin.forecast_period = bulletin.forecast_period
        @bulletin.forecast_day_city = bulletin.forecast_day_city
      when 'sea'
        @bulletin.summer = (params[:variant] == 'summer')
        @bulletin.storm = bulletin.storm
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.forecast_period = bulletin.forecast_period
        @bulletin.forecast_sea_day = bulletin.forecast_sea_day
        @bulletin.forecast_sea_period = bulletin.forecast_sea_period
        @bulletin.meteo_data = bulletin.meteo_data
        @bulletin.forecast_day_city = bulletin.forecast_day_city
      when 'daily'
        @bulletin.summer = (params[:variant] == 'summer')
        @bulletin.storm = bulletin.storm
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.forecast_period = bulletin.forecast_period
        @bulletin.forecast_advice = bulletin.forecast_advice
        @bulletin.forecast_orientation = bulletin.forecast_orientation
        @bulletin.meteo_data = '' #[] #bulletin.meteo_data # 20190212 согласовано с синоптиками
        @bulletin.agro_day_review = bulletin.agro_day_review
        # @bulletin.climate_data = bulletin.climate_data
        prev_date = @bulletin.report_date-1.day
        prev_set = DonetskClimateSet.find_by(mm: prev_date.month, dd: prev_date.day)
        curr_set = DonetskClimateSet.find_by(mm: @bulletin.report_date.month, dd: @bulletin.report_date.day)
        @bulletin.climate_data = (prev_set.present? ? prev_set.t_avg.to_s : '') + '; ' +
          (prev_set.present? ? prev_set.t_max.to_s : '') + '; ' + (prev_set.present? ? prev_set.year_max.to_s : '') + '; '+
          (curr_set.present? ? curr_set.t_min.to_s : '') + '; ' + (curr_set.present? ? curr_set.year_min.to_s : '') + ';'
        @bulletin.forecast_day_city = bulletin.forecast_day_city
        
        @m_d = @bulletin.meteo_data.split(";")
        max_day = SynopticObservation.max_day_temperatures(@bulletin.report_date-1.day)
        push_in_m_d(max_day,0)
        min_night = SynopticObservation.min_night_temperatures(@bulletin.report_date)
        push_in_m_d(min_night,1)
        avg_24 = AgroObservation.temperature_avg_24(@bulletin.report_date.strftime("%Y-%m-%d"))
        push_in_m_d(avg_24,2)
        at_9_o_clock = SynopticObservation.current_temperatures(6, @bulletin.report_date)
        push_in_m_d(at_9_o_clock,3)
        precipitation_day = SynopticObservation.precipitation(18, @bulletin.report_date-1.day)
        precipitation_night = SynopticObservation.precipitation(6, @bulletin.report_date)
        precipitation = []
        (1..10).each do |i| 
          if precipitation_day[i].present?
            precipitation[i] = precipitation_day[i]>989 ? ((precipitation_day[i]-990)*0.1).round(1) : precipitation_day[i]
          end
          if precipitation_night[i].present?
            precipitation[i] ||= 0
            precipitation[i] += precipitation_night[i]>989 ? ((precipitation_night[i]-990)*0.1).round(1) : precipitation_night[i]
          end
        end
        push_in_m_d(precipitation,4)
        if @bulletin.summer
        else
          snow_height = SynopticObservation.snow_cover_height(@bulletin.report_date)
          push_in_m_d(snow_height,5)
          depth_freezing = AgroObservation.depth_freezing(@bulletin.report_date.strftime("%Y-%m-%d"))
          push_in_m_d(depth_freezing,6)
        end
        wind_speed_max = AgroObservation.wind_speed_max_24(@bulletin.report_date.strftime("%Y-%m-%d"))
        push_in_m_d(wind_speed_max,7)
        @bulletin.meteo_data = ''
        @m_d.each do |v|
          @bulletin.meteo_data += v.present? ? "#{v};" : ';'
        end
    end
  end
  
  def create
    @bulletin = Bulletin.new(bulletin_params)
    @bulletin.summer = params[:summer] if params[:summer].present?
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{@bulletin.inspect}")
    if params[:val_1].present?
      @bulletin.meteo_data = ''
      (1..n).each do |i|
        @bulletin.meteo_data += params["val_#{i}"].present? ? params["val_#{i}"]+'; ' : ';'
      end
    end
    if @bulletin.bulletin_type == 'daily'
      @bulletin.climate_data = params[:avg_day_temp] + '; ' + params[:max_temp] + '; '+ params[:max_temp_year] + '; ' + params[:min_temp] + '; '+ params[:min_temp_year] + '; '
    end
    @bulletin.curr_number ||= Date.today.yday().to_s+'-tv' if @bulletin.bulletin_type == 'tv'
    if not @bulletin.save
      render :new
    else
      # MeteoMailer.welcome_email(current_user).deliver_now
      flash[:success] = "Бюллетень создан"
      redirect_to "/bulletins/list?bulletin_type=#{@bulletin.bulletin_type}"
      # redirect_to "/bulletins/#{@bulletin.id}/bulletin_show"
    end
  end
  
  def edit
  end

  def update
    if params[:val_1].present?
      @bulletin.meteo_data = ''
      (1..n).each do |i|
        @bulletin.meteo_data += params["val_#{i}"].present? ? params["val_#{i}"].strip+'; ' : ';'
      end
    end
    if @bulletin.bulletin_type == 'daily'
      @bulletin.climate_data = params[:avg_day_temp] + '; ' + params[:max_temp] + '; '+ params[:max_temp_year] + '; ' + params[:min_temp] + '; '+ params[:min_temp_year] + '; '
    end
    if not @bulletin.update_attributes bulletin_params
      render :action => :edit
    else
      # redirect_to "/bulletins/#{@bulletin.id}/bulletin_show"
      flash[:success] = "Бюллетень изменен"
      redirect_to "/bulletins/list?bulletin_type=#{@bulletin.bulletin_type}"
    end
  end

  def destroy
    bulletin_type = @bulletin.bulletin_type
    @bulletin.destroy
    flash[:success] = "Бюллетень удален"
    redirect_to "/bulletins/list?bulletin_type="+bulletin_type
  end
  
  # def pdf_png_delete
  #   filename = File.join(Rails.root, "app/assets/pdf_folder", @bulletin.pdf_filename)
  #   File.delete(filename) if File.exist?(filename)
  #   filename = File.join(Rails.root, "app/assets/pdf_folder", @bulletin.png_filename)
  #   File.delete(filename) if File.exist?(filename)
  # end

  def show
  end
  
  def print_bulletin
  end

  def pdf_2_png
    doc   = Grim.reap("app/assets/pdf_folder/#{@bulletin.pdf_filename(current_user.id)}")
    if doc.count == 1
      if Rails.env.production?
        doc[0].save("#{Rails.root}/public/images/#{@bulletin.png_filename(current_user.id)}")
      else
        doc[0].save("app/assets/pdf_folder/#{@bulletin.png_filename(current_user.id)}")
      end
    else
      doc.each do |page|
        if Rails.env.production?
          doc[0].save("#{Rails.root}/public/images/#{@bulletin.png_page_filename(current_user.id, 0)}")
          doc[1].save("#{Rails.root}/public/images/#{@bulletin.png_page_filename(current_user.id, 1)}")
        else
          doc[0].save("app/assets/pdf_folder/#{@bulletin.png_page_filename(current_user.id, 0)}")
          doc[1].save("app/assets/pdf_folder/#{@bulletin.png_page_filename(current_user.id, 1)}")
        end
      end
    end
    return true
  end
  
  def save_as_pdf(pdf)
    filename = File.join(Rails.root, "app/assets/pdf_folder", @bulletin.pdf_filename(current_user.id))
    pdf.render_file(filename)
  end

  def bulletin_show
    respond_to do |format|
      case @bulletin.bulletin_type
        when 'daily'
          pdf = Daily.new(@bulletin)
          @png_filename_page1 = "Bulletin_daily_#{current_user.id}-0.png" 
          @png_filename_page2 = "Bulletin_daily_#{current_user.id}-1.png"
        when 'sea'
          pdf = Sea.new(@bulletin)
          @png_filename_page1 = @bulletin.png_page_filename(current_user.id, 0)
          @png_filename_page2 = @bulletin.png_page_filename(current_user.id, 1)
        when 'holiday'
          pdf = Holiday.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'storm', 'sea_storm'
          pdf = Storm.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'radiation'
          pdf = Radiation.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'tv'
          pdf = Tv.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'avtodor'
          pdf = Avtodor.new(@bulletin)
        when 'radio'
          pdf = Radio.new(@bulletin)
      end
      format.html do
        save_as_pdf(pdf)
        # pdf_2_png
      end
      format.pdf do
        send_data pdf.render, filename: @bulletin.pdf_filename(current_user.id), type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
    end
  end
  
  def help_show
    pdf = HelpChem.new
    respond_to do |format|
      format.pdf do
        send_data pdf.render, filename: "help_chem.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
    end
  end

  private
  
    def bulletin_params
      params.require(:bulletin).permit(:report_date, :curr_number, :duty_synoptic, :synoptic1, :synoptic2, :storm, :forecast_day, :forecast_day_city, :forecast_period, :forecast_advice, :forecast_orientation, :forecast_sea_day, :forecast_sea_period, :meteo_data, :agro_day_review, :climate_data, :summer, :bulletin_type, :storm_hour, :storm_minute, :picture, :chief, :responsible)
    end
    
    def find_bulletin
      @bulletin = Bulletin.find(params[:id])
    end
    
    def n
      case @bulletin.bulletin_type
        when 'sea'
          15
        when 'radiation'
          4
        # when 'tv'
          # 38
        when 'radio'
          22
        when 'avtodor'
          16
        else
          72        
      end
    end
    
    def push_in_m_d(data, offset)
      id_stations = [1,3,2,10,8,4,7,5]
      data.each.with_index do |v,i| 
        if v.present?
          row = id_stations.index(i)
          @m_d[row*9+offset] = v.to_s if row.present?
        end
      end
    end
end
