class AgroDecMeteoData < Prawn::Document
  def initialize(year, month, decade, stations, telegrams)
    super :page_size => "A4", :page_layout => :landscape
    # super(top_margin: 40)		
    # start_new_page size: "A3", layout: :landscape
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans", style: :bold
    bounding_box([0, y_pos], :width => bounds.width) do
      text "Таблица для записи метеорологических данных декадных агрометеорологических телеграмм (холодный период года)", align: :center, size: 16
    end
    move_down 10
    text "Декада: #{decade}. Месяц: #{month}. Год: #{year}.", size: 12
    move_down 20
    font "OpenSans", style: :normal
    @telegrams = telegrams
    @stations = stations
    table agro_dec_meteo_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 7 } do |t|
      # t.cells.border_width = 0
    end
  end
  def agro_dec_meteo_data
    table = []
    @telegrams.each do |t|
      row = []
      row << @stations[t["station_id"]]
      row << t["temperature_dec_avg_delta"]
      row << t["temperature_dec_avg"]
      row << t["temperature_dec_max"]
      row << t["temperature_dec_min"]
      row << t["dry_dec_day_num"]
      row << t["temperature_dec_min_soil"]
      row << t["cold_soil_dec_day_num"]
      row << t["precipitation_dec"]
      row << t["precipitation_dec_percent"]
      row << t["wet_dec_day_num"]
      row << t["wind_speed_dec_max"]
      row << t["wind_speed_dec_max_day_num"]
      row << t["duster_dec_day_num"]
      row << t["height_snow_cover"]
      row << t["snow_cover"]
      row << t["snow_cover_density"]
      row << t["number_measurements_0"]
      row << t["number_measurements_3"]
      row << t["number_measurements_30"]
      row << t["ice_crust"]
      row << t["thickness_ice_cake"]
      row << t["depth_thawing_soil_2"]
      row << t["depth_soil_freezing"]
      row << t["thermometer_index"]
      row << t["temperature_dec_min_soil3"]
      row << t["height_snow_cover_rail"]
      table << row
    end
    [
      [{content: 'Метеостанция', align: :center, rowspan: 3, width: 100, height: 200}, {content: 'Температура воздуха', colspan: 4}, {content: 'Число дней с относительной влажностью воздуха 30% и менее', rowspan: 3, rotate: 90}, {content: 'Температура на поверхности почвы или снежного покрова', colspan: 2}, {content: 'Осадки', colspan: 3}, {content: 'Ветер', colspan: 3}, {content: 'Снежный покров по результатам снегосъемки', colspan: 6}, {content: 'Ледяная корка', colspan: 2}, {content: 'Условия перезимовки', colspan: 4},{content: 'Высота снежного покрова в день с минимальной температурой на глубине узла кущения (см)', rowspan: 3, rotate: 90}],
      [{content: 'Отклонение от среднего многолетнего', rowspan: 2, rotate: 90},{content: 'Средняя за декаду,°С', rowspan: 2, rotate: 90},{content: 'Максимальная за декаду,°С', rowspan: 2, rotate: 90},{content: 'Минимальная за декаду,°С', rowspan: 2, rotate: 90},
      {content: 'Минимальная за декаду,°С', rowspan: 2, rotate: 90},{content: 'Число суток с температурой на поверхности почвы -20°С и ниже', rowspan: 2, rotate: 90},
      {content: 'Количество осадков за декаду (мм)', rowspan: 2, rotate: 90},{content: 'Количество за декаду в процентах от среднего многолетнего', rowspan: 2, rotate: 90},{content: 'Количество дней за декаду с количеством осадков за сутки 1 мм и более', rowspan: 2, rotate: 90},
      {content: 'Максимальная скорость ветра за декаду (м/с)', rowspan: 2, rotate: 90},{content: 'Количество дней за декаду с максимальной скоростью ветра за сутки 15 м/с и более', rowspan: 2, rotate: 90},{content: 'Количество дней за декаду с пылевыми бурями', rowspan: 2, rotate: 90},
      {content: 'Средняя высота на последний день декады (см)', rowspan: 2, rotate: 90},{content: 'Характеристика залегания', rowspan: 2, rotate: 90},{content: 'Средняя плотность (г/см<sup>3</sup>)', rowspan: 2, rotate: 90},{content: 'Число промеров', colspan: 3},{content: 'Распределение ледяной корки, баллы', rowspan: 2, rotate: 90},{content: 'Средняя толщина ледяной корки (мм)', rowspan: 2, rotate: 90, height: 160},{content: 'На последний день декады', colspan: 2},{content: 'Название прибора', rowspan: 2, rotate: 90},{content: 'Минимальная температура почвы на глубине узла кущения,°С', rowspan: 2, rotate: 90}],
      [{content: 'с высотой 0 см', rotate: 90}, {content: 'с высотой 1-3 см', rotate: 90}, {content: 'с высотой более 30 см', rotate: 90}, {content: 'Глубина оттаивания (см)', rotate: 90}, {content: 'Глубина промерзания (см)', rotate: 90}]
    ] + table
  end
end