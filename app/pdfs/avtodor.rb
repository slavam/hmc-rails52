# require 'prawn'
class Avtodor < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 80, right_margin: 50, bottom_margin: 0)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    image "./app/assets/images/eagle.png", :scale => 0.4, position: :center # at: [235, y_pos], 
    font "OpenSans", style: :bold
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([0, cursor], width: bounds.width) do
      text "ул. Любавина, 2, г. Донецк, 83015 тел. (062) 311-40-10 тел./факс (062)340-99-25", align: :center, size: 10
      text "web: www.dnmchs.ru  Идентификационный код 51001468  E-mail: gidromet@mail.dnmchs.ru", align: :center, size: 10
    end
    
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 11} № 0#{Bulletin.ogmo_code}/"+@bulletin.curr_number
      # text "К договору от 22.12.2020 № 04/21/06" 20220110 KMA
      text "К договору от 30.12.2021 № 04/22/06"
    end
    bounding_box([290, y_pos], width: bounds.width-290) do
      text "Врио директора
            ГУП ДНР \"АВТОДОР\"
		
            Е.М. Крутенко", leading: 3
    end
    move_down 15
    font "OpenSans", style: :bold
    if @bulletin.storm.present?
      bounding_box([0, cursor-10], :width => bounds.width) do
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, :color => "ff0000"
        font "OpenSans"
        move_down 10
        text @bulletin.storm, indent_paragraphs: 40, leading: 3, align: :justify # 20190703 KMA
      end
    end
    move_down 10
    # report_date = @bulletin.report_date.strftime("%Y-%m-%d")
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width) do
      text "Прогноз погоды", align: :center
      move_down 5
      font "OpenSans", style: :normal
      text @bulletin.header_daily, align: :center
      text "в Донецкой Народной Республике", align: :center
    end
    move_down 8
    font "OpenSans"
    text @bulletin.forecast_day, leading: 3
    move_down 10
    report_date_prev = (@bulletin.report_date - 1.day).strftime("%Y-%m-%d")
    font "OpenSans", style: :bold
    text "Метеорологические данные за #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]} #{report_date_prev[0,4]} года", align: :center
    font "OpenSans", style: :normal
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    m_d.each.with_index do |e,i|
      if e>' '
        if ([1,5,9,13].index(i).present?) && (e.to_f < 1.0)
          m_d[i] = 'менее 1'
        else
          m_d[i] = e.gsub('.',',')
        end
      end
    end
    table_content = [["Название метеостанции", "Средняя за сутки температура воздуха, °C", "Количество осадков за сутки, мм", "Вид осадков", "Скорость ветра, м/с"],
                     ["Донецк",       m_d[0],  m_d[1],  m_d[2],  m_d[3]], 
                     ["Дебальцево",   m_d[4],  m_d[5],  m_d[6],  m_d[7]],
                     ["Амвросиевка",  m_d[8],  m_d[9],  m_d[10], m_d[11]],
                     ["Седово",       m_d[12], m_d[13], m_d[14], m_d[15]]]
    font "OpenSans"
    table table_content, width: bounds.width, column_widths: [90, 110,70,140], :cell_style => {overflow: :shrink_to_fit, :inline_format => true, size: 10 } do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
      t.column(0).align = :left
      t.row(0).column(0).align = :center
      (0..3).each {|i| 
        if (m_d[i*4+2].present? && width_of(m_d[i*4+2], size: 10) >140)
          t.row(i+1).column(3).height = 18
        end
      }
    end
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    # table_content =[[chief_descr[:position], {:image => chief_descr[:image_name], scale: 0.6}, chief_descr[:name]]]
    # table_content =[[{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
    table_content =[[{:padding => [10,5],:content => chief_descr[:position]}, '', {:padding => [10,5],:content => chief_descr[:name]}]]
                    
# table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|                    
    table table_content, width: bounds.width, :column_widths => [200, 170], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text responsible_descr[:full_name]+" (062) 303-10-45", size: 10
  end
end