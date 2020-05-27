class Hydro < Prawn::Document
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
      text "ГИДРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 12
      text "#{@bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center, color: "ff0000", size: 12
    end
    move_down 20
    font "OpenSans", size: 9

    table_data = [
      [
        {content: '№ п/п', valign: :center},
        {content: 'Река', valign: :center},
        {content: 'Пост', valign: :center},
        {content: 'Уровень воды в 8 часов над "0" графика (см)', rotate: 90, height: 110},
        {content: 'Изменение уровня воды за сутки (см)', rotate: 90},
        {content: 'Уровень выхода воды на пойму над "0" графика (см)', rotate: 90},
        {content: 'Превышение над уровнем выхода воды на пойму (см)', rotate: 90},
        {content: "Средний многолетний уровень (#{@bulletin.forecast_period}) над '0' графика (см)", rotate: 90},
        {content: 'Ледовые явления', valign: :center}
      ]
    ]
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    (0..6).each do |i|
      a = [i+1]
      (0..7).each do |j|
        a << (m_d[i*8+j].present? ? m_d[i*8+j] : '')
      end
      table_data << a
    end
    font "OpenSans", size: 10
    table table_data, width: bounds.width, :column_widths => [20,60,80,40,40,40,40,50], cell_style: { inline_format: true } do |t|
      t.cells.padding = [2,1,2,1]
      t.cells.align = :center
      t.column(1).align = :left
      t.column(2).align = :left
      t.row(0).align = :center
    end
    move_down 10

    move_down 10
    text @bulletin.forecast_day, size: 10
    # text "Бюллетень выпускается при установлении 4 класса и прогнозировании 5 класса пожарной опасности", size: 10
    bounding_box([0, cursor], :width => bounds.width) do
      text "Время выпуска 13:00", size: 10
    end
    if @bulletin.forecast_day_city.present?
      text @bulletin.forecast_day_city
    end
    move_down 10
    table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
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
      [{padding: [10,0],content: 'Начальник отдела гидрологии'}, {image: "./app/assets/images/arameleva.png", scale: 0.15, vposition: :center}, {padding: [20,5],content: 'О.В. Арамелева'}],
      [{padding: [10,0],content: chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {padding: [10,5], content: chief_descr[:name]}]]
  end
end
