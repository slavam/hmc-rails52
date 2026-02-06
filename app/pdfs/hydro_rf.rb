class HydroRf < Prawn::Document
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
    ugms_header_gmc
    font "OpenSans", style: :bold
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text "ГИДРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number}", align: :center, size: 12, color: "0000ff"
      text "#{@bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center, color: "0000ff", size: 12
    end
    move_down 20
    month_name = Bulletin::MONTH_NAMES[@bulletin.report_date.month]
    font "OpenSans", size: 9
    table_data = [
      [
        {content: '', valign: :center},
        {content: 'Река', valign: :center},
        {content: 'Пост', valign: :center},
        {content: 'Уровень воды в 08:00 часов (см)', rotate: 90, height: 125},
        {content: 'Изменение уровня воды за сутки (см)', rotate: 90},
        {content: "Средний многолетний уровень (за #{month_name})", rotate: 90},
        {content: 'Уровень начала затопления (см)', rotate: 90},
        {content: 'Ледовые явления', valign: :center}
      ]
    ]
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    m = @bulletin.report_date.month()
    (0..12).each {|i| 
      a = [i+1]
      a << HydroObservation::RIVERS[i]
      a << HydroObservation::TOWNS[i]
      a << m_d[3*i] 
      a << m_d[3*i+1]
      a << HydroObservation::LONGTERM_LEVEL_AVG[i+1][m]
      a << HydroObservation::FLOOD_ONSET_LEVEL[i]
      a << m_d[3*i+2]
      table_data << a
    }
    font "OpenSans", size: 10
    table table_data, width: bounds.width, :column_widths => [20,100,125,30,30,30,30], cell_style: { :overflow => :shrink_to_fit, inline_format: true} do |t|
      t.cells.padding = [3,1,4,3]
      t.cells.align = :center
      t.column(1).align = :left
      t.column(2).align = :left
      t.row(0).align = :center
    end
    move_down 10
    text @bulletin.forecast_day, size: 10
    # bounding_box([0, cursor], :width => bounds.width) do
    #   text "Время выпуска 13:00", size: 10
    # end
    if @bulletin.forecast_day_city.present?
      text @bulletin.forecast_day_city
    end
    move_down 10
    table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(0).height = 17
      t.row(2).size = 11
      t.column(1).position = :center
    end
  end
  def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.hydro_responsible_2_pdf
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{responsible_descr.inspect}")
    [ [{padding: [1,0],content: "Ответственный за выпуск:"},"",""],
      [{padding: [10,0],content: responsible_descr[:position]}, "", {padding: [20,5],content: responsible_descr[:full_name]}],
      [{padding: [10,0],content: chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {padding: [10,5], content: chief_descr[:name]}]]
  end
end