class CropDamage < ActiveRecord::Base
  belongs_to :agro_observation

  def height_snow_cover_rail_to_s(value)
    if value == 0
      "Снегосъемка не проводилась"
    elsif value == 997
      "Меньше 0.5"
    else
      value.to_s
    end
  end

end
