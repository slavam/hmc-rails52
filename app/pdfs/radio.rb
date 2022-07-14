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
    text 'ГБУ "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР МЧС ДНР"', align: :center, size: 14
    move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS2, align: :center, size: 10
    end
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    text @bulletin.report_date.strftime("%d.%m.%Y")+'г.  № '+@bulletin.curr_number+"-РС"
    move_down 20
    font "OpenSans", style: :bold
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    font "OpenSans"
    text @bulletin.header_daily, align: :center
    text "в Донецкой Народной Республике", align: :center
    move_down 10
    text @bulletin.forecast_day, leading: 3
    text @bulletin.forecast_period, leading: 3
    move_down 10
    table temps, width: bounds.width,:cell_style => { :align => :center, :inline_format => true, :padding => [2, 2, 2, 2], :size => 11} do |t|
      t.column(0).align = :left
      t.row(0).column(0).align = :center
    end
    # responsible_descr = @bulletin.responsible_2_pdf
    if @bulletin.chief.present?
      chief_descr = @bulletin.chief_2_pdf
      move_down 10
      table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5], align: :right, :content => chief_descr[:name]}]]                    
      table table_content, width: bounds.width, :column_widths => [200, 150], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
        t.cells.border_width = 0
      end
    end
    
    move_cursor_to 20
    synoptic_name = @bulletin.synoptic1.present? ? @bulletin.synoptic1 : 'Синоптик'
    text_box synoptic_name + " (062) 303-10-34", :at => [0, 30], size: 9
    # text responsible_descr[:full_name]+" (062) 303-10-45", size: 10 20190718 KMA
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