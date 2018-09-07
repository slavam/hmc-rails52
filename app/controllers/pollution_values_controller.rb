class PollutionValuesController < ApplicationController
  before_action :find_pollution_value, only: [:destroy, :edit, :update, :delete_value]
  
  # def get_chem_bc_data
  #   start_date = params[:start_date]
  #   end_date = params[:end_date]
  #   post_id = params[:post_id].to_i
  #   material_id = params[:material_id].to_i
  #   substance = Material.find(material_id).name
  #   concentrations = get_concentrations(start_date, end_date, post_id, material_id)
  #   if post_id == 0
  #     site_description = "г. Донецк (посты 5, 7, 9, 14)"
  #   else
  #     post = Post.find(post_id)
  #     site_description = post.name+'. Координаты: '+post.coordinates.to_s
  #   end
  #   render json: {startDate: start_date, endDate: end_date, siteDescription: site_description, substance: substance, concentrations: concentrations}
  # end
  
  def background_concentrations
    @start_date = params[:start_date].present? ? params[:start_date] : (Time.now - 3.years).strftime("%Y-%m-%d")
    @end_date = params[:end_date].present? ? params[:end_date] : Time.now.strftime("%Y-%m-%d")
    @posts = Post.actual.select(:id, :name).order(:id).to_a + [Post.new(id: 0, name: 'г. Донецк (5, 7, 9, 14)')]
    post_id = params[:post_id].present? ? params[:post_id].to_i : 5 
    if post_id == 0
      @site_description = "г. Донецк (посты 5, 7, 9, 14)"
    else
      post = Post.find(post_id)
      @site_description = post.name+'. Координаты: '+post.coordinates.to_s
    end
    
    material_id = params[:material_id].present? ? params[:material_id].to_i : 1 # dust
    @substance = Material.find(material_id).name
    @materials = Material.actual_materials

    @concentrations = get_concentrations(@start_date, @end_date, post_id, material_id)
    respond_to do |format|
      format.html
      format.json do
        # Rails.logger.debug("My object >>>>>>>>>>>>>>>>: #{@concentrations.inspect}")       
        render json: {startDate: @start_date, endDate: @end_date, siteDescription: @site_description, substance: @substance, concentrations: @concentrations}
      end
      format.pdf do
        pdf = BackgroundConcentrations.new(@start_date, @end_date, @site_description, @substance, @concentrations)
        send_data pdf.render, filename: "background_concentrations_#{current_user.id}.pdf", type: "application/pdf", disposition: "inline", :force_download=>true, :page_size => "A4"
      end
    end

  end

  def edit
  end

  def update
    optical_density = params[:pollution_value][:value].to_f
    concentration = (optical_density.nil? ? nil : calc_concentration(@pollution_value.measurement, @pollution_value.material_id, optical_density))
    if not @pollution_value.update(value: optical_density, concentration: concentration)
      render :action => :edit
    else
      redirect_to measurements_path
    end
  end
  
  def delete_value
    master_record_id = @pollution_value.measurement_id
    @pollution_value.destroy
    concentrations = Measurement.find(master_record_id).get_density_and_concentration
    render :json => { :errors => ["Удалена запись о загрязнении"], concentrations: concentrations }
  end
  
  def destroy
    @pollution_value.destroy
    flash[:success] = "Загрязнение удалено"
    redirect_to measurements_path
  end
  
  private
    def pollution_value_params
      params.require(:pollution_value).permit(:value, :concentration)
    end
    
    def find_pollution_value
      @pollution_value = PollutionValue.find(params[:id])
    end
    
    # def calc_concentration(measurement, material_id, optical_density)
    #   post = Post.find(measurement.post_id)
    #   laboratory_id = post.laboratory_id
    #   chem_coefficient = ChemCoefficient.find_by(material_id: material_id, laboratory_id: laboratory_id)
    #   if chem_coefficient.nil? 
    #     return optical_density # nil
    #   end
    #   t_kelvin = measurement.temperature + 273.0
    #   pressure = measurement.atmosphere_pressure / 1.334 # гигапаскали -> мм. рт. ст
    #   if material_id == 1 # пыль
    #     v_normal = pressure/t_kelvin*0.359*post.sample_volume_dust
    #     return optical_density/v_normal*1000 # м куб -> дм куб
    #   end
    #   v_normal = pressure/t_kelvin*0.359*chem_coefficient.sample_volume
    #   m = optical_density*chem_coefficient.calibration_factor
    #   con = (m*chem_coefficient.solution_volume)/(v_normal*chem_coefficient.aliquot_volume)
    #   return con
    # end

    def avg(arr)
      (arr.inject(:+).to_f / arr.size.to_f).round(4)
    end
    
    def transition_function(variance)
      # (1/(1+C244^2))*EXP(1.645*КОРЕНЬ(LN(1+C244^2)))
      s = 1.0 + variance*variance
      return ((1.0/s)*Math.exp(1.645*(Math.sqrt(Math.log(s))))).round(4)
    end
    
    def std_dev(arr)
      return 0 if arr.size < 2
      avg = arr.mean
      s = 0
      arr.each do |a| 
        # s += (a.to_f - avg)*(a.to_f - avg)
        s += (a.to_f - avg)**2
      end
      return Math.sqrt(s/(arr.size - 1).to_f).round(4)
    end
    
    def get_concentrations(start_date, end_date, post_id, material_id)
      region_id = post_id == 0 ? ' in (5, 7, 9, 14) ' : ' = '+post_id.to_s
      my_query = "SELECT pv.value, me.wind_speed speed, me.wind_direction direction, me.date FROM pollution_values pv 
                    JOIN measurements me ON me.id=pv.measurement_id AND me.date >= '#{start_date}' AND me.date <= '#{end_date}'
                    WHERE me.post_id #{region_id} AND pv.material_id=#{material_id} ;"
      concentrations = PollutionValue.find_by_sql(my_query)
      conc_by_direction = {}
      conc_by_direction[:calm] = []
      conc_by_direction[:north] = []
      conc_by_direction[:east] = []
      conc_by_direction[:south] = []
      conc_by_direction[:west] = []
      conc_by_direction[:avg_calm] = 0
      conc_by_direction[:avg_north] = 0
      conc_by_direction[:avg_east] = 0
      conc_by_direction[:avg_south] = 0
      conc_by_direction[:avg_west] = 0
      conc_by_direction[:background_concentration_calm] = 0
      conc_by_direction[:background_concentration_north] = 0
      conc_by_direction[:background_concentration_east] = 0
      conc_by_direction[:background_concentration_south] = 0
      conc_by_direction[:background_concentration_west] = 0
      conc_by_direction[:standard_deviation_calm] = 0
      conc_by_direction[:standard_deviation_north] = 0
      conc_by_direction[:standard_deviation_east] = 0
      conc_by_direction[:standard_deviation_south] = 0
      conc_by_direction[:standard_deviation_west] = 0
      conc_by_direction[:variance_calm] = 0
      conc_by_direction[:variance_north] = 0
      conc_by_direction[:variance_east] = 0
      conc_by_direction[:variance_south] = 0
      conc_by_direction[:variance_west] = 0
      conc_by_direction[:transition_function_calm] = 0
      conc_by_direction[:transition_function_north] = 0
      conc_by_direction[:transition_function_east] = 0
      conc_by_direction[:transition_function_south] = 0
      conc_by_direction[:transition_function_west] = 0
      conc_by_direction[:concentration_calm] = 0
      conc_by_direction[:concentration_north] = 0
      conc_by_direction[:concentration_east] = 0
      conc_by_direction[:concentration_south] = 0
      conc_by_direction[:concentration_west] = 0
      conc_by_direction[:conc_bcg_avg5] = 0
      conc_by_direction[:conc_bcg_avg4] = 0
      conc_by_direction[:size] = 0
      conc_by_direction[:measurement_total] = 0
      conc_by_direction[:avg_total] = 0
      conc_by_direction[:avg_total_math] = 0
      conc_by_direction[:standard_deviation_total] = 0
      conc_by_direction[:standard_deviation_total_math] = 0
      conc_by_direction[:variance_total] = 0
      return conc_by_direction if concentrations.count < 1
      conc_by_direction[:measurement_total] = concentrations.count
      total = []
      concentrations.each do |c|
        total.push c['value'].to_f
        if c['speed'].to_i < 3
          conc_by_direction[:calm].push c['value'].to_f.round(4)
        else
          direction = c['direction'].to_i*10
          case direction
            when 90-44..90+45
              conc_by_direction[:east].push c['value'].to_f.round(4)
            when 180-44..180+45
              conc_by_direction[:south].push c['value'].to_f.round(4)
            when 270-44..270+45
              conc_by_direction[:west].push c['value'].to_f.round(4) if c['value'].present?
            else
              conc_by_direction[:north].push c['value'].to_f.round(4)
          end
        end
      end
      conc_by_direction[:avg_total_math] = total.mean.round(4)
      conc_by_direction[:avg_total] = avg(total)
      conc_by_direction[:standard_deviation_total] = std_dev(total)
      conc_by_direction[:standard_deviation_total_math] = total.standard_deviation.round(4)
      conc_by_direction[:variance_total] = (conc_by_direction[:standard_deviation_total]/conc_by_direction[:avg_total]).round(4)
      # standard deviation
      # conc_by_direction[:standard_deviation_calm]  = conc_by_direction[:calm].standard_deviation.round(4)
      # conc_by_direction[:standard_deviation_north] = conc_by_direction[:north].standard_deviation.round(4)
      # conc_by_direction[:standard_deviation_east]  = conc_by_direction[:east].standard_deviation.round(4)
      # conc_by_direction[:standard_deviation_south] = conc_by_direction[:south].standard_deviation.round(4)
      # conc_by_direction[:standard_deviation_west]  = conc_by_direction[:west].standard_deviation.round(4)
      conc_by_direction[:standard_deviation_calm]  = std_dev(conc_by_direction[:calm]) # conc_by_direction[:calm].standard_deviation.round(4)
      conc_by_direction[:standard_deviation_north] = std_dev(conc_by_direction[:north]) # conc_by_direction[:north].standard_deviation.round(4)
      conc_by_direction[:standard_deviation_east]  = std_dev(conc_by_direction[:east]) # conc_by_direction[:east].standard_deviation.round(4)
      conc_by_direction[:standard_deviation_south] = std_dev(conc_by_direction[:south]) # conc_by_direction[:south].standard_deviation.round(4)
      conc_by_direction[:standard_deviation_west]  = std_dev(conc_by_direction[:west]) # conc_by_direction[:west].standard_deviation.round(4)
      # average
      conc_by_direction[:avg_calm]  = conc_by_direction[:calm].mean.round(4) if conc_by_direction[:calm].size > 0
      conc_by_direction[:avg_north] = conc_by_direction[:north].mean.round(4) if conc_by_direction[:north].size > 0
      conc_by_direction[:avg_east]  = conc_by_direction[:east].mean.round(4) if conc_by_direction[:east].size > 0
      conc_by_direction[:avg_south] = conc_by_direction[:south].mean.round(4) if conc_by_direction[:south].size > 0
      conc_by_direction[:avg_west]  = conc_by_direction[:west].mean.round(4) if conc_by_direction[:west].size > 0
      # max size from 5
      conc_by_direction[:size] = [conc_by_direction[:calm].size, 
                                   conc_by_direction[:north].size, 
                                   conc_by_direction[:east].size, 
                                   conc_by_direction[:south].size, 
                                   conc_by_direction[:west].size].max()
                       
      # коэффициент вариации                                   
      conc_by_direction[:variance_calm]  = (conc_by_direction[:standard_deviation_calm] /conc_by_direction[:avg_calm]).round(4) if (conc_by_direction[:calm].size > 0) and (conc_by_direction[:avg_calm] > 0)
      conc_by_direction[:variance_north] = (conc_by_direction[:standard_deviation_north]/conc_by_direction[:avg_north]).round(4) if (conc_by_direction[:north].size > 0) and (conc_by_direction[:avg_north] > 0)
      conc_by_direction[:variance_east]  = (conc_by_direction[:standard_deviation_east] /conc_by_direction[:avg_east]).round(4) if (conc_by_direction[:east].size > 0) and (conc_by_direction[:avg_east] > 0)
      conc_by_direction[:variance_south] = (conc_by_direction[:standard_deviation_south]/conc_by_direction[:avg_south]).round(4) if (conc_by_direction[:south].size > 0) and (conc_by_direction[:avg_south] > 0)
      conc_by_direction[:variance_west]  = (conc_by_direction[:standard_deviation_west] /conc_by_direction[:avg_west]).round(4) if (conc_by_direction[:west].size > 0) and (conc_by_direction[:avg_west] > 0)
      # функция перехода
      conc_by_direction[:transition_function_calm]  = transition_function(conc_by_direction[:variance_calm])
      conc_by_direction[:transition_function_north] = transition_function(conc_by_direction[:variance_north])
      conc_by_direction[:transition_function_east]  = transition_function(conc_by_direction[:variance_east])
      conc_by_direction[:transition_function_south] = transition_function(conc_by_direction[:variance_south])
      conc_by_direction[:transition_function_west]  = transition_function(conc_by_direction[:variance_west])
      # концентрация с функцией перехода
      conc_by_direction[:concentration_calm] = (conc_by_direction[:transition_function_calm] * conc_by_direction[:avg_calm]).round(4) if conc_by_direction[:calm].size > 0
      conc_by_direction[:concentration_north] = (conc_by_direction[:transition_function_north] * conc_by_direction[:avg_north]).round(4) if conc_by_direction[:north].size > 0
      conc_by_direction[:concentration_east] = (conc_by_direction[:transition_function_east] * conc_by_direction[:avg_east]).round(4) if conc_by_direction[:east].size > 0
      conc_by_direction[:concentration_south] = (conc_by_direction[:transition_function_south] * conc_by_direction[:avg_south]).round(4) if conc_by_direction[:south].size > 0
      conc_by_direction[:concentration_west] = (conc_by_direction[:transition_function_west] * conc_by_direction[:avg_west]).round(4) if conc_by_direction[:west].size > 0

      conc_by_direction[:conc_bcg_avg5] = ((conc_by_direction[:concentration_calm]*conc_by_direction[:calm].size +
                                           conc_by_direction[:concentration_north]*conc_by_direction[:north].size +
                                           conc_by_direction[:concentration_east]*conc_by_direction[:east].size +
                                           conc_by_direction[:concentration_south]*conc_by_direction[:south].size +
                                           conc_by_direction[:concentration_west]*conc_by_direction[:west].size) / (conc_by_direction[:calm].size+conc_by_direction[:north].size+conc_by_direction[:east].size+conc_by_direction[:south].size+conc_by_direction[:west].size)).round(4)

      conc_by_direction[:conc_bcg_avg4] = ((conc_by_direction[:concentration_north]*conc_by_direction[:north].size +
                                           conc_by_direction[:concentration_east]*conc_by_direction[:east].size +
                                           conc_by_direction[:concentration_south]*conc_by_direction[:south].size +
                                           conc_by_direction[:concentration_west]*conc_by_direction[:west].size) / (conc_by_direction[:north].size+conc_by_direction[:east].size+conc_by_direction[:south].size+conc_by_direction[:west].size)).round(4)                                           

      conc_by_direction[:background_concentration_calm]  = conc_by_direction[:concentration_calm]
      conc_by_direction[:background_concentration_north] = conc_by_direction[:concentration_north]
      conc_by_direction[:background_concentration_east]  = conc_by_direction[:concentration_east]
      conc_by_direction[:background_concentration_south] = conc_by_direction[:concentration_south]
      conc_by_direction[:background_concentration_west]  = conc_by_direction[:concentration_west]
      c_b5 = [conc_by_direction[:concentration_calm], conc_by_direction[:concentration_north], conc_by_direction[:concentration_east], conc_by_direction[:concentration_south], conc_by_direction[:concentration_west]]
# Rails.logger.debug("My object 1: #{conc_by_direction.inspect}")       
      if ((c_b5.max - conc_by_direction[:conc_bcg_avg5]) <= (conc_by_direction[:conc_bcg_avg5]*0.25)) and ((conc_by_direction[:conc_bcg_avg5] - c_b5.min) <= (conc_by_direction[:conc_bcg_avg5]*0.25))
        conc_by_direction[:background_concentration_calm]  = conc_by_direction[:conc_bcg_avg5]
        conc_by_direction[:background_concentration_north] = conc_by_direction[:conc_bcg_avg5]
        conc_by_direction[:background_concentration_east]  = conc_by_direction[:conc_bcg_avg5]
        conc_by_direction[:background_concentration_south] = conc_by_direction[:conc_bcg_avg5]
        conc_by_direction[:background_concentration_west]  = conc_by_direction[:conc_bcg_avg5]
      else
        c_b4 = [conc_by_direction[:concentration_north], conc_by_direction[:concentration_east], conc_by_direction[:concentration_south], conc_by_direction[:concentration_west]]
        if ((c_b4.max - conc_by_direction[:conc_bcg_avg4]) <= conc_by_direction[:conc_bcg_avg4]*0.25) and ((conc_by_direction[:conc_bcg_avg4] - c_b4.min) <= conc_by_direction[:conc_bcg_avg4]*0.25)
          conc_by_direction[:background_concentration_calm]  = conc_by_direction[:concentration_calm]
          conc_by_direction[:background_concentration_north] = conc_by_direction[:conc_bcg_avg4]
          conc_by_direction[:background_concentration_east]  = conc_by_direction[:conc_bcg_avg4]
          conc_by_direction[:background_concentration_south] = conc_by_direction[:conc_bcg_avg4]
          conc_by_direction[:background_concentration_west]  = conc_by_direction[:conc_bcg_avg4]
        end
      end
      return conc_by_direction
    end

end
