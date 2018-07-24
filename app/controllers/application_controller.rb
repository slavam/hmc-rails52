class ApplicationController < ActionController::Base
  include SessionsHelper
  
  def calc_concentration(measurement, material_id, optical_density)
    post = Post.find(measurement.post_id)
    laboratory_id = post.laboratory_id
    chem_coefficient = ChemCoefficient.find_by(material_id: material_id, laboratory_id: laboratory_id)
    if chem_coefficient.nil? 
      return optical_density # nil
    end
    t_kelvin = measurement.temperature + 273.0
    pressure = measurement.atmosphere_pressure / 1.334 # гигапаскали -> мм. рт. ст
    if material_id == 1 # пыль
      v_normal = pressure/t_kelvin*0.359*post.sample_volume_dust
      return optical_density/v_normal*1000 # м куб -> дм куб
    end
    v_normal = pressure/t_kelvin*0.359*chem_coefficient.sample_volume
    m = optical_density*chem_coefficient.calibration_factor
    con = (m*chem_coefficient.solution_volume)/(v_normal*chem_coefficient.aliquot_volume)
    return con
  end
end
