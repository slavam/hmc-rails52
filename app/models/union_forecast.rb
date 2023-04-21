class UnionForecast < ApplicationRecord
  def self.ogmo_chief(name)
    ret = {}
    case name
      when "М.Б. Лукьяненко"
        ret[:position] = "Начальник"
        ret[:image_name] = "./app/assets/images/chief.png"
      when "Н.В. Стец"
        ret[:position] = "Врио начальника"
        ret[:image_name] = "./app/assets/images/stec.png"
      when "О.В. Арамелева"
        ret[:position] = "Врио начальника"
        ret[:image_name] = "./app/assets/images/arameleva2.png"
      else
        ret[:position] = "Начальник отдела гидрометеорологического обеспечения" # и обслуживания"
        ret[:image_name] = "./app/assets/images/head_of_dep.png"
    end
    ret[:name] = name
    ret
  end
end
