class Fire2 < Prawn::Document
  include HeadersDoc
  def initialize(bulletin)
		super(top_margin: 40, right_margin: 40, left_margin: 80)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    bulletin_header(y_pos)
    move_down 10
    bounding_box([0, cursor], width: bounds.width) do
      text "БЮЛЛЕТЕНЬ ПОЖАРНОЙ ОПАСНОСТИ № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 12
      text "#{@bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center, color: "ff0000", size: 12
    end
    move_down 10
    font "OpenSans"
    text "Информация о фактической пожарной опасности по погодным ", align: :center
    text "условиям и прогноз классов пожарной опасности на 1-3 суток", align: :center
    text "в Донецкой Народной Республике", align: :center
    move_down 10

    table_data = [
      [{content: "
      Города и районы ДНР", rowspan:3},
      {content: "Класс пожарной опасности", colspan:4},
      ],
      ["Фактический",
      {content: "Ожидаемый", colspan:3}
      ],
      ["#{@bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]}",
      "#{(@bulletin.report_date+1.day).day} #{Bulletin::MONTH_NAME2[(@bulletin.report_date+1.day).month]}",
      "#{(@bulletin.report_date+2.day).day} #{Bulletin::MONTH_NAME2[(@bulletin.report_date+2.day).month]}",
      "#{(@bulletin.report_date+3.day).day} #{Bulletin::MONTH_NAME2[(@bulletin.report_date+3.day).month]}"
      ]
    ]
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    Bulletin::REGIONS2.each.with_index do |s, j|
      a = [s]
      (0..3).each do |i|
        a << (m_d[j*4+i].present? ? m_d[j*4+i] : '')
      end
      table_data << a
    end

    table table_data, width: bounds.width, cell_style: { inline_format: true } do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
      t.column(0).align = :left
      t.row(0).column(0).align = :center
    end
    move_down 10
    table_content = [
      ["<b>Класс пожарной опасности</b>", "<b>Степень опасности</b>"],
      ["1 класс","отсутствует"],
      ["2 класс","малая"],
      ["3 класс","средняя"],
      ["4 класс","высокая"],
      ["5 класс","чрезвычайная"]
      ]
    table table_content, width: bounds.width, cell_style: {size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0.5
      t.cells.padding = [1, 3]
      t.row(0).align = :center
    end
    move_down 10
    text @bulletin.forecast_day, size: 10
    # text "Бюллетень выпускается при установлении 4 класса и прогнозировании 5 класса пожарной опасности", size: 10
    move_down 10
    bounding_box([0, cursor], :width => bounds.width) do
      text "Время выпуска 16:00", size: 10
    end
  end
end
