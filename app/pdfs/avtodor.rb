require 'prawn'
class Avtodor < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40)		
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    image "./app/assets/images/eagle.png", at: [235, y_pos], :scale => 0.5
    font "OpenSans", style: :bold
    move_down 80
    bounding_box([50, cursor], :width => 470) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([50, cursor], :width => 470) do
      text "ул. Любавина, 2, г. Донецк, 83015 тел. (062) 311-40-10 тел./факс (062)340-99-25", align: :center, size: 10
      text "web: www.dnmchs.ru  Идентификационный код 51001468  E-mail: gidromet@mail.dnmchs.ru", align: :center, size: 10
      # text Bulletin::ADDRESS, align: :center, size: 10
    end
    
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+' № 03/'+@bulletin.curr_number
      text 'На № 04/18/03 от 09.01.2018'
    end
    bounding_box([350, y_pos], width: bounds.width-300) do
      text "Директору
            Государственного предприятия
            'АВТОДОР'
		
            А.С. Николаеву"
    end
    if @bulletin.storm.present?
      move_down 10
      bounding_box([0, cursor-10], :width => bounds.width) do
        font "OpenSans", style: :bold
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, :color => "ff0000"
        font "OpenSans"
        text @bulletin.storm
      end
    end
    move_down 10
    font "OpenSans", style: :bold
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    font "OpenSans"
    report_date = @bulletin.report_date.strftime("%Y-%m-%d")
    report_date_next = (@bulletin.report_date + 1.day).strftime("%Y-%m-%d")
    # text @bulletin.report_date_as_str, :color => "0000FF", align: :center
    text "на сутки с 21 часа #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} до 21 часа #{report_date_next[8,2]} #{Bulletin::MONTH_NAME2[report_date_next[5,2].to_i]} #{report_date_next[0,4]} года", align: :center
    text "в Донецкой Народной Республике", align: :center
    # font "OpenSans"
    text @bulletin.forecast_day
    move_down 10
    report_date_prev = (@bulletin.report_date - 1.day).strftime("%Y-%m-%d")
    font "OpenSans", style: :bold
    text "Метеорологические данные за #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]} #{report_date_prev[0,4]} года", align: :center
    font "OpenSans", style: :normal
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    table_content = [["Название метеостанции", "Средняя за сутки температура воздуха, °C", "Количество осадков за сутки, мм", "Вид осадков", "Скорость ветра, м/с"],
                     ["Донецк",m_d[0], m_d[1], m_d[2], m_d[3]], 
                     ["Дебальцево", m_d[4], m_d[5], m_d[6], m_d[7]],
                     ["Амвросиевка", m_d[8], m_d[9], m_d[10], m_d[11]],
                     ["Седово", m_d[12], m_d[13], m_d[14], m_d[15]]]
    font "OpenSans"
    table table_content, width: bounds.width, :cell_style => { :inline_format => true } do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
    end
    move_down 10
    chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    table_content =[[chief_descr[:position], {:image => chief_descr[:image_name], scale: 0.6}, chief_descr[:name]]]
                    
    table table_content, width: bounds.width, :column_widths => [300, 100], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text responsible_descr[:name]+" (062) 303-10-45"
  end
end