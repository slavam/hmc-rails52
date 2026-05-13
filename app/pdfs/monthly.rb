class Monthly < Prawn::Document
  def initialize(data, type, year)
    super :page_size => "A4", :page_layout => :landscape
		@data = data
		font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    hdrs = [
      "Средняя по месяцам температура воздуха (°С) в #{@year} году",
      "Среднее по месяцам атмосферное давление на уровне станции в #{year} году",
      "Минимальное по месяцам атмосферное давление на уровне станции в #{year} году",
      "Максимальное по месяцам атмосферное давление на уровне станции в #{year} году",
      "Среднее по месяцам атмосферное давление на уровне моря в #{year} году",
      "Среднее по месяцам количество общей облачности в #{year} году",
      "Средняя по месяцам скорость ветра в #{year} году",
      "Количество осадков по месяцам в #{year} году",
      "Средняя по месяцам относительная влажность воздуха в #{year} году"
    ]
    move_down 20
    font "OpenSans", style: :bold
    report_type = %w[avg_temp avg_pressure_station_level min_pressure_station_level max_pressure_station_level avg_pressure_sea_level avg_cloud avg_wind_speed precipitation avg_humidity]
    text hdrs[report_type.index(type)], size: 12, align: :center
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      t.cells.padding = [2,2]
    end
  end
  def table_data
    months = ['<b>Метеостанции</b>', '<b>Январь</b>', '<b>Февраль</b>', '<b>Март</b>', '<b>Апрель</b>', '<b>Май</b>', '<b>Июнь</b>', '<b>Июль</b>', '<b>Август</b>', '<b>Сентябрь</b>', '<b>Октябрь</b>', '<b>Ноябрь</b>', '<b>Декабрь</b>']
    table = [months]
    (1..6).each do |j|
      row = []
      (0..12).each do |i|
        row << ((@data[j].present? and @data[j][i].present? and @data[j][i] != -99) ? @data[j][i] : '')
      end
      table << row
    end
    table
  end
end