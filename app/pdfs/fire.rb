class Fire < Prawn::Document
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
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.25
    font "OpenSans" #, style: :bold
    bounding_box([0, y_pos], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS, align: :center, size: 9
    end
    move_down 40
    bounding_box([0, cursor], width: bounds.width) do
      text "БЮЛЛЕТЕНЬ ПОЖАРНОЙ ОПАСНОСТИ № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 12
      text "#{@bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center, color: "ff0000", size: 12
    end
    move_down 20
    font "OpenSans"
    text "Информация о фактической пожарной опасности по погодным условиям", align: :center
    text "и прогноз классов пожарной опасности на 1-3 суток", align: :center
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
    move_down 5
    text @bulletin.forecast_day, size: 10
    bounding_box([0, cursor], :width => bounds.width) do
      text "Время выпуска 16:00", size: 10
    end
    move_down 5
    table signatures, width: bounds.width, :column_widths => [230,160], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(0).height = 17
      t.row(2).size = 11
      t.column(1).position = :center
      # t.cells.padding = [1, 0]
    end
  end
  def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    [ [{padding: [1,0],content: "Ответственный за выпуск:"},"",""],
      [{padding: [10,0],content:responsible_descr[:position]}, {:image => responsible_descr[:image_name], scale: 0.5, :vposition => :center}, {:padding => [20,5],:content => responsible_descr[:name]}],
      [{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.5}, {:padding => [10,5],:content => chief_descr[:name]}]]
  end
end
