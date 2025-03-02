class Dte < Prawn::Document
  include HeadersDoc
  def initialize(bulletin)
		# super(top_margin: 40, left_margin: 95, right_margin: 50, bottom_margin: 0)
    super(left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      # :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      # :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    # image "./app/assets/images/eagle.png", :scale => 0.4, position: :center # at: [235, y_pos], 
    # font "OpenSans", style: :bold
    # move_down 20
    # bounding_box([0, cursor], width: bounds.width) do
    #   text Bulletin::HEAD, align: :center, size: 10
    # end
    # move_down 10
    # font "OpenSans" #, style: :italic
    # bounding_box([0, cursor], width: bounds.width) do
    #   text Bulletin::ADDRESS2, align: :center, size: 10
    # end
    y_pos = cursor
    font "OpenSans"
    bulletin_header(y_pos)
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № #{Bulletin.ogmo_code}/"+@bulletin.curr_number
      text "К договору от 12.02.2024 № 05/24/02.01"
    end
    
    bounding_box([280, y_pos], width: bounds.width-280) do
      text "Генеральному директору
            ГУП ДНР \"Донбасстеплоэнерго\"
		
            С.В. Полхову", leading: 3
    end
    
    move_down 50
    font "OpenSans", style: :bold
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    move_down 20
    font "OpenSans"
    text @bulletin.header_daily, align: :center
    move_down 5
    text "в Донецкой Народной Республике", align: :center
    move_down 10
    text @bulletin.forecast_day, leading: 3
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
                    
    table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]                    
    table table_content, width: bounds.width, :column_widths => [200, 150], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text responsible_descr[:full_name]+" +7(949) 554-78-30", size: 10
  end
end