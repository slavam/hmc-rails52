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
    @bulletins = Bulletin.where(bulletin_type: @bulletin_type).paginate(page: params[:page], per_page: 20).order(:created_at).reverse_order
    respond_to do |format|
      format.html 
      # format.json do
      #   render json: {bulletins: @bulletins}
      # end
    end
  end
  
  def new_bulletin
    @bulletin = Bulletin.new
    @bulletin.report_date = Time.now.strftime("%Y-%m-%d")
    @bulletin.curr_number = Date.today.yday()
    @bulletin.bulletin_type = params[:bulletin_type] 
    bulletin = Bulletin.last_this_type params[:bulletin_type]
    last_daily_bulletin = Bulletin.last_this_type 'daily' # ОН 20190307 
    case params[:bulletin_type]
      when 'dte'
        @bulletin.forecast_day = last_daily_bulletin.forecast_day
      when 'radio'
        @bulletin.forecast_day = last_daily_bulletin.forecast_day
        @bulletin.meteo_data = bulletin.meteo_data if bulletin.present?
      when 'radiation'
        # @bulletin.meteo_data = bulletin.meteo_data if bulletin.present?
        @m_d = fill_radiation_meteo_data(@bulletin.report_date)
        @bulletin.meteo_data = ''
        @m_d.each do |v|
          @bulletin.meteo_data += v.present? ? "#{v};" : ';'
        end
      when 'storm', 'sea_storm'
        @bulletin.curr_number = ''
        if bulletin.present?
          @bulletin.meteo_data = bulletin.meteo_data 
          @bulletin.forecast_day = bulletin.forecast_day
          @bulletin.storm = bulletin.storm
        end
      when 'avtodor'
        if last_daily_bulletin.present?
          # @bulletin.meteo_data = bulletin.meteo_data 
          @bulletin.forecast_day = last_daily_bulletin.forecast_day
          @bulletin.storm = last_daily_bulletin.storm
        end
        @m_d = fill_avtodor_meteo_data(@bulletin.report_date)
        @bulletin.meteo_data = ''
        @m_d.each do |v|
          @bulletin.meteo_data += v.present? ? "#{v};" : ';'
        end
      when 'holiday'
        @bulletin.forecast_day = last_daily_bulletin.forecast_day
        @bulletin.storm = last_daily_bulletin.storm
        @bulletin.forecast_period = last_daily_bulletin.forecast_period
        @bulletin.forecast_day_city = last_daily_bulletin.forecast_day_city
      when 'sea'
        @bulletin.review_start_date = Date.yesterday
        @bulletin.summer = (params[:variant] == 'summer')
        @bulletin.storm = bulletin.storm
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.forecast_period = bulletin.forecast_period
        @bulletin.forecast_sea_day = bulletin.forecast_sea_day
        @bulletin.forecast_sea_period = bulletin.forecast_sea_period
        @m_d = fill_sea_meteo_data(@bulletin.report_date)
        @bulletin.meteo_data = ''
        @m_d.each do |v|
          @bulletin.meteo_data += v.present? ? "#{v};" : ';'
        end
        @bulletin.forecast_day_city = bulletin.forecast_day_city
      when 'daily'
        @bulletin.review_start_date = Date.yesterday
        @bulletin.summer = (params[:variant] == 'summer')
        @bulletin.storm = bulletin.storm
        @bulletin.forecast_day = bulletin.forecast_day
        @bulletin.forecast_period = bulletin.forecast_period
        @bulletin.forecast_advice = bulletin.forecast_advice
        @bulletin.forecast_orientation = bulletin.forecast_orientation
        @bulletin.meteo_data = '' #[] #bulletin.meteo_data # 20190212 согласовано с синоптиками
        @bulletin.agro_day_review = bulletin.agro_day_review
        prev_date = @bulletin.report_date-1.day
        prev_set = DonetskClimateSet.find_by(mm: prev_date.month, dd: prev_date.day)
        curr_set = DonetskClimateSet.find_by(mm: @bulletin.report_date.month, dd: @bulletin.report_date.day)
        @bulletin.climate_data = (prev_set.present? ? prev_set.t_avg.to_s : '') + '; ' +
          (prev_set.present? ? prev_set.t_max.to_s : '') + '; ' + (prev_set.present? ? prev_set.year_max.to_s : '') + '; '+
          (curr_set.present? ? curr_set.t_min.to_s : '') + '; ' + (curr_set.present? ? curr_set.year_min.to_s : '') + ';'
        @bulletin.forecast_day_city = bulletin.forecast_day_city
        @m_d = fill_meteo_data(@bulletin.report_date)      
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
    if !params[:val_1].nil?
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
    case @bulletin.bulletin_type
      when 'daily'
        # ОН 20190307 выбирать данные из базы каждый раз
        @m_d = fill_meteo_data(@bulletin.report_date)
      when 'sea'
        @m_d = fill_sea_meteo_data(@bulletin.report_date)
      when 'radiation'
        @m_d = fill_radiation_meteo_data(@bulletin.report_date)
      when 'avtodor'
        @m_d = fill_avtodor_meteo_data(@bulletin.report_date)
      else
        @m_d = []
    end
    @bulletin.meteo_data = ''
    @m_d.each do |v|
      @bulletin.meteo_data += v.present? ? "#{v};" : ';'
    end
  end

  def update
    if !params[:val_1].nil?
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
      Rails.logger.debug("My object+++++++++++++++++: #{@bulletin.meteo_data.inspect}")
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
          case params[:variant]
            when 'two_pages'
              pdf = Daily.new(@bulletin)
            when 'one_page'
              pdf = DailyOnePage.new(@bulletin)
            when 'short'
              pdf = DailyShort.new(@bulletin)
          end
          # @png_filename_page1 = "Bulletin_daily_#{current_user.id}-0.png" 
          # @png_filename_page2 = "Bulletin_daily_#{current_user.id}-1.png"
        when 'sea'
          pdf = Sea.new(@bulletin)
          # @png_filename_page1 = @bulletin.png_page_filename(current_user.id, 0)
          # @png_filename_page2 = @bulletin.png_page_filename(current_user.id, 1)
        when 'holiday'
          pdf = Holiday.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'storm', 'sea_storm'
          pdf = Storm.new(@bulletin)
          # @png_filename = @bulletin.png_filename(current_user.id)
        when 'radiation'
          pdf = Radiation.new(@bulletin)
          # @png_filename = @bulletin.png_filename(current_user.id)
        when 'tv'
          pdf = Tv.new(@bulletin)
          @png_filename = @bulletin.png_filename(current_user.id)
        when 'avtodor'
          pdf = Avtodor.new(@bulletin)
        when 'radio'
          pdf = Radio.new(@bulletin)
        when 'dte'
          pdf = Dte.new(@bulletin)
      end
      format.html do
        save_as_pdf(pdf)
        # pdf_2_png
      end
      format.pdf do
        if @bulletin.bulletin_type == 'daily'
            pdf_file_name = "Bulletin_daily_#{current_user.id}_#{params[:variant]}.pdf"
            send_data pdf.render, filename: pdf_file_name, type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
        else
          send_data pdf.render, filename: @bulletin.pdf_filename(current_user.id), type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
        end
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
      params.require(:bulletin).permit(:report_date, :curr_number, :duty_synoptic, :synoptic1, :synoptic2, :storm, :forecast_day, :forecast_day_city, :forecast_period, :forecast_advice, :forecast_orientation, :forecast_sea_day, :forecast_sea_period, :meteo_data, :agro_day_review, :climate_data, :summer, :bulletin_type, :storm_hour, :storm_minute, :picture, :chief, :responsible, :review_start_date)
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
    
    def push_in_m_d(m_d, data, offset)
      id_stations = [1,3,2,10,8,4,7,5]
      data.each.with_index do |v,i| 
        if v.present?
          row = id_stations.index(i)
          m_d[row*9+offset] = v.to_s if row.present?
        end
      end
    end

    def fill_sea_meteo_data(report_date)
      sedovo_id = 10
      m_d = []
      m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
      value = SynopticObservation.max_day_temperatures(report_date-1.day)[sedovo_id]
      m_d[0] = value if value.present?
      value = SynopticObservation.min_night_temperatures(report_date)[sedovo_id]
      m_d[1] = value if value.present?
      value = SynopticObservation.current_temperatures(6, report_date)[sedovo_id]
      m_d[2] = value if value.present?
      value = precipitation_daily(report_date, false)[sedovo_id]
      m_d[3] = value if value.present?
      if @bulletin.summer
      else
        value = SynopticObservation.snow_cover_height(report_date)[sedovo_id]
        m_d[13] = value if value.present?
      end
      value = SeaObservation.sea_level(report_date)
      m_d[7] = value if value.present?
      level_yesterday = SeaObservation.sea_level(report_date-1.day)
      if m_d[7].present? and level_yesterday.present?
        m_d[8] = m_d[7].to_i - level_yesterday.to_i
        if m_d[8] > 0
          m_d[8] = '+'+m_d[8].to_s
        else
          m_d[8] = m_d[8].to_s
        end  
      end
      value = SeaObservation.water_temperature(report_date)
      m_d[9] = value if value.present?
      syn_o = SynopticObservation.find_by(station_id: 10, term: 6, date: report_date)
      m_d[12] = syn_o.visibility if syn_o.present? 
      m_d
    end
    def fill_radiation_meteo_data(report_date)
      m_d = []
      m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
      radiations = AgroObservation.radiations(report_date)
      [1,3,2,10].each_with_index {|v,i| m_d[i] = radiations[v].present? ? radiations[v] : correct_radiation(report_date, v)}
      m_d
    end
    
    def correct_radiation(report_date, station_id)
      r_o = RadiationObservation.find_by(date_observation: report_date, hour_observation: 0, station_id: station_id)
      # ret = r_o.present? ? r_o.telegram[20,3].to_i : nil 20190614 Boyko
      if r_o.present?
        index = r_o.telegram[17] == ' ' ? 20 : 21 # old or new format
        ret = r_o.telegram[index,3].to_i
      else
        ret = nil
      end
      ret
    end
    def fill_avtodor_meteo_data(report_date)
      m_d = []
      m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
      avg_24 = AgroObservation.temperature_avg_24(report_date-1.day) #.strftime("%Y-%m-%d"))
      wind_speed = AgroObservation.wind_speed_max_24(report_date-1.day)
      precipitations = precipitation_daily(report_date-1.day, true)
      [1,3,2,10].each_with_index do |v,i| 
        m_d[i*4] = avg_24[v] if avg_24[v].present?
        m_d[i*4+1] = precipitations[v] if precipitations[v].present?
        m_d[i*4+3] = wind_speed[v] if wind_speed[v].present?
      end
      m_d
      # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{m_d.inspect}")
    end
    
    def fill_meteo_data(report_date)
      m_d = []
      m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
      max_day = SynopticObservation.max_day_temperatures(report_date-1.day)
      push_in_m_d(m_d, max_day,0)
      min_night = SynopticObservation.min_night_temperatures(@bulletin.report_date)
      push_in_m_d(m_d, min_night,1)
      avg_24 = AgroObservation.temperature_avg_24(@bulletin.report_date.strftime("%Y-%m-%d"))
      push_in_m_d(m_d, avg_24,2)
      # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{m_d[2].inspect}")
      m_d[3*9+2] = SynopticObservation.station_daily_local_avg_temp(10, report_date-1.day) if m_d[3*9+2].nil? #Sedovo
      m_d[7*9+2] = SynopticObservation.station_daily_local_avg_temp(5, report_date-1.day) if m_d[7*9+2].nil? #Mariupol
      at_9_o_clock = SynopticObservation.current_temperatures(6, @bulletin.report_date)
      push_in_m_d(m_d, at_9_o_clock,3)
      precipitation = precipitation_daily(report_date, false)
      push_in_m_d(m_d, precipitation,4)
      if @bulletin.summer
        temperature_min_soil = AgroObservation.temperature_min_soil_24(@bulletin.report_date)
        push_in_m_d(m_d, temperature_min_soil,5)
        relative_humidity_min = AgroObservation.relative_humidity_min_24(@bulletin.report_date)
        push_in_m_d(m_d, relative_humidity_min,6)
        o_o = OtherObservation.find_by(data_type: 'min_hum', station_id: 10, obs_date: @bulletin.report_date)
        m_d[3*9+6] = o_o.value if o_o.present? # мин влажность по Седово 20190529
      else
        snow_height = SynopticObservation.snow_cover_height(@bulletin.report_date)
        push_in_m_d(m_d, snow_height,5)
        depth_freezing = AgroObservation.depth_freezing(@bulletin.report_date.strftime("%Y-%m-%d"))
        push_in_m_d(m_d, depth_freezing,6)
      end
      wind_speed_max = AgroObservation.wind_speed_max_24(@bulletin.report_date.strftime("%Y-%m-%d"))
      push_in_m_d(m_d, wind_speed_max,7)
      m_d
    end
    def precipitation_daily(report_date, one_day)
      # one_day - телеграммы за 6 и 18 из одних суток
      precipitation = []
      if one_day
        date_18_clock = report_date
      else
        date_18_clock = report_date-1.day
      end
      precipitation_day = SynopticObservation.precipitation(18, date_18_clock)
      precipitation_night = SynopticObservation.precipitation(6, report_date)
      (1..10).each do |i| 
        if precipitation_day[i].present?
          precipitation[i] = precipitation_day[i]>989 ? ((precipitation_day[i]-990)*0.1).round(1) : precipitation_day[i]
        end
        if precipitation_night[i].present?
          precipitation[i] ||= 0
          precipitation[i] += precipitation_night[i]>989 ? ((precipitation_night[i]-990)*0.1).round(1) : precipitation_night[i]
        end
      end
      precipitation
    end
end
