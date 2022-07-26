class Temperature30 < Prawn::Document
  def initialize(temperatures, num_days, year, month_name)
    super :page_size => "A4", left_margin: 95
    @num_days = num_days
    @temperatures = temperatures
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    font "OpenSans"
    move_down 20
    text "Температура воздуха (°С) с 1 по #{@num_days} #{month_name} #{year} года в сроки 9, 12, 15 и 18 часов местного времени в городах Ясиноватая, Иловайск, Дебальцево, Волноваха, Мариуполь по данным репрезентативных метеорологических станций", align: :center, size: 12
    move_down 20
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 8, align: :center } do |t|
      t.before_rendering_page do |page|
        page.row(2).border_top_width = 1
        page.column(0).border_right_width = 2
        page.column(4).border_right_width = 2
        page.column(8).border_right_width = 2
        page.column(12).border_right_width = 2
        page.column(16).border_right_width = 2
        page.column(-1).border_right_width = 2
      end

      t.cells.padding = [2,2]
      values = t.cells.columns(1..-1).rows(2..-1)
      hot = values.filter do |cell|
        cell.content.to_i >= 30
      end
      hot.background_color = "FFAAAA"
    end
  end
  def table_data
    table = []
    (1..@num_days).each do |j|
      row = [j]
      (0..19).each do |i|  
        row << (@temperatures[j].present? && @temperatures[j][i].present? ? @temperatures[j][i] : '')
      end
      table << row
    end
    [
      [
        {content: '<b>День месяца</b>', rowspan: 2},
        {content: '<b>Ясиноватая</b>', colspan: 4},
        {content: '<b>Иловайск</b>', colspan: 4},
        {content: '<b>Дебальцево</b>', colspan: 4},
        {content: '<b>Волноваха</b>', colspan: 4},
        {content: '<b>Мариуполь</b>', colspan: 4}
      ],
      ['9','12','15','18','9','12','15','18','9','12','15','18','9','12','15','18','9','12','15','18']
    ] + table
  end
end