class UnionForecast < ApplicationRecord
  def self.ogmo_chief(name)
    ret = {}
    if name == "Л.Н. Бойко"
      ret[:position] = "Начальник отдела гидрометеорологического обеспечения и обслуживания"
      ret[:image_name] = "./app/assets/images/head_of_dep.png"
      # ret[:full_name] = "Бойко Любовь Николаевна"
    else
      ret[:position] = "Врио начальника отдела гидрометеорологического обеспечения и обслуживания"
      ret[:image_name] = "./app/assets/images/kian.png"
      # ret[:full_name] = "Кияненко Маргарита Анатольевна"
    end
    ret[:name] = name
    ret
  end
end
