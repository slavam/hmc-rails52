class BackgroundConcentrations < Prawn::Document
  def initialize(start_date, end_date, site_description, substance, concentrations)
		super(top_margin: 40)		
		@concentrations = concentrations
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans", style: :bold
    bounding_box([0, y_pos], :width => bounds.width) do
      text "Промежуточный результат расчета фоновых концентраций", align: :center, size: 16
    end
    move_down 20
    font "OpenSans", style: :normal
    text "За период с #{start_date} по #{end_date}"
    text site_description
    text "Вещество #{substance}"
    move_down 20
    table concentrations_table, width: bounds.width, :column_widths => [110], cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9 } do |t|
      # t.cells.border_width = 0
    end
    move_down 20
  end
  def concentrations_table
    table = []
    # 
    # (0..6).each do |j|
      row = []
      row[0] = "Число измерений"
      row[1] = @concentrations[:calm].size
      row[2] = @concentrations[:north].size
      row[3] = @concentrations[:east].size
      row[4] = @concentrations[:south].size
      row[5] = @concentrations[:west].size
      row[6] = @concentrations[:measurement_total]
      table << row
      row = []
      row[0] = "Средняя концентрация за период"
      row[1] = @concentrations[:avg_calm]
      row[2] = @concentrations[:avg_north]
      row[3] = @concentrations[:avg_east]
      row[4] = @concentrations[:avg_south]
      row[5] = @concentrations[:avg_west]
      row[6] = @concentrations[:avg_total]
      table << row
      row = []
      row[0] = "Среднеквадратичное отклонение"
      row[1] = @concentrations[:standard_deviation_calm]
      row[2] = @concentrations[:standard_deviation_north]
      row[3] = @concentrations[:standard_deviation_east]
      row[4] = @concentrations[:standard_deviation_south]
      row[5] = @concentrations[:standard_deviation_west]
      row[6] = @concentrations[:standard_deviation_total]
      table << row
      row = []
      row[0] = "Коэффициент вариации"
      row[1] = @concentrations[:variance_calm]
      row[2] = @concentrations[:variance_north]
      row[3] = @concentrations[:variance_east]
      row[4] = @concentrations[:variance_south]
      row[5] = @concentrations[:variance_west]
      row[6] = @concentrations[:variance_total]
      table << row
      row = []
      row[0] = "Функция перехода"
      row[1] = @concentrations[:transition_function_calm]
      row[2] = @concentrations[:transition_function_north]
      row[3] = @concentrations[:transition_function_east]
      row[4] = @concentrations[:transition_function_south]
      row[5] = @concentrations[:transition_function_west]
      row[6] = ''
      table << row
      row = []
      row[0] = "Концентрация"
      row[1] = @concentrations[:concentration_calm]
      row[2] = @concentrations[:concentration_north]
      row[3] = @concentrations[:concentration_east]
      row[4] = @concentrations[:concentration_south]
      row[5] = @concentrations[:concentration_west]
      row[6] = @concentrations[:conc_bcg_avg5]
      table << row
      row = []
      row[0] = "Фоновая концентрация"
      row[1] = @concentrations[:background_concentration_calm]
      row[2] = @concentrations[:background_concentration_north]
      row[3] = @concentrations[:background_concentration_east]
      row[4] = @concentrations[:background_concentration_south]
      row[5] = @concentrations[:background_concentration_west]
      row[6] = ''
      table << row
    # end
    [
      ['', '<b>Ветер менее 3 м/с</b>','<b>Ветер северный</b>', '<b>Ветер восточный</b>', '<b>Ветер южный</b>', '<b>Ветер западный</b>', '<b>Всего</b>']
    ] + table
  end
end