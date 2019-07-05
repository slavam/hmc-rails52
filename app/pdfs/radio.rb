# require 'prawn'
class Radio < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 80, right_margin: 50, bottom_margin: 0)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    bounding_box([300, y_pos], width: bounds.width-290) do
      text "Приложение
            к Плану передачи информации", leading: 3
    end
    move_down 20
    font "OpenSans", style: :bold
    text "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР МЧС ДНР", align: :center, size: 14
    move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([0, cursor], width: bounds.width) do
      text "ул. Любавина, 2, г. Донецк, 83015 тел. (062) 311-40-10 тел./факс (062)340-99-25", align: :center, size: 10
      text "web: www.dnmchs.ru  Идентификационный код 51001468  E-mail: gidromet@mail.dnmchs.ru", align: :center, size: 10
    end

    # bounding_box([50, cursor], :width => 470) do
    #   text "ул. Любавина, 2, г. Донецк, 83015 тел. (062) 311-40-10 тел./факс (062)340-99-25", align: :center, size: 10
    #   text "web: www.dnmchs.ru  Идентификационный код 51001468  E-mail: gidromet@mail.dnmchs.ru", align: :center, size: 10
    #   # text Bulletin::ADDRESS, align: :center, size: 10
    # end
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    text @bulletin.report_date.strftime("%d.%m.%Y")+'г.  № '+@bulletin.curr_number+"-РС"
    move_down 20
    font "OpenSans", style: :bold
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    font "OpenSans"
    report_date = @bulletin.report_date.strftime("%Y-%m-%d")
    report_date_next = (@bulletin.report_date + 1.day).strftime("%Y-%m-%d")
    # text @bulletin.report_date_as_str, :color => "0000FF", align: :center
    text "на сутки с 21 часа #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} до 21 часа #{report_date_next[8,2]} #{Bulletin::MONTH_NAME2[report_date_next[5,2].to_i]} #{report_date_next[0,4]} года", align: :center
    text "в Донецкой Народной Республике", align: :center
    move_down 10
    text @bulletin.forecast_day, leading: 3
    move_down 10
    table temps, width: bounds.width,:cell_style => { :align => :center, :inline_format => true, :padding => [2, 2, 2, 2], :size => 11} do |t|
      t.column(0).align = :left
      t.row(0).column(0).align = :center
    end
    responsible_descr = @bulletin.responsible_2_pdf
    move_cursor_to 20
    text responsible_descr[:full_name]+" (062) 303-10-45", size: 10
    # text responsible_descr[:name]+" (062) 303-10-45"
  end
  def temps
    ret = [["<b>Город</b>",	"<b>Температура воздуха ночью (°C)</b>", "<b>Температура воздуха днем (°C)</b>"]]
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    i = 0
    Bulletin::RADIO_CITIES.each do |c|
      ret << [c, m_d[i*2], m_d[i*2+1]]
      i += 1
    end
    return ret
  end
end