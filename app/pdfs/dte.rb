# require 'prawn'
class Dte < Prawn::Document
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
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № 03/"+@bulletin.curr_number
      text "На № 08/18-19/03  #{Prawn::Text::NBSP * 3}от 29.08.2018"
      # text "На № 04/18/03 #{Prawn::Text::NBSP * 3}от 09.01.2018"
    end
    bounding_box([290, y_pos], width: bounds.width-290) do
      text "Генеральному директору
            ГП \"Донбасстеплоэнерго\"
		
            А.В. Кочетову", leading: 3
    end
    
    move_down 50
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
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    # table_content =[[chief_descr[:position], {:image => chief_descr[:image_name], scale: 0.6}, chief_descr[:name]]]
    # table table_content, width: bounds.width, :column_widths => [300, 100], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
    #   t.cells.border_width = 0
    # end
                    
    table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]                    
    table table_content, width: bounds.width, :column_widths => [200, 170], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text responsible_descr[:full_name]+" (062) 303-10-45", size: 10
    # text responsible_descr[:name]+" (062) 303-10-45"
  end
end