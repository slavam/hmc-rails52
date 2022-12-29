class BusStation < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 95, right_margin: 50, bottom_margin: 0)
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
      text Bulletin::ADDRESS2, align: :center, size: 10
    end
    
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № 0#{Bulletin.ogmo_code}/"+@bulletin.curr_number
      text "К договору от 11.01.2022 № 01/22/06"
    end
    
    bounding_box([250, y_pos], width: bounds.width-250) do
      text "Врио директора 
            ФИЛИАЛА № 3
            \"АВТОВОКЗАЛЫ ДОНБАССА\"
            ГК \"ДОНТЕХ\"
		
            Р.И. Маркелову", leading: 3
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
                    
    table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, "", {:padding => [10,5],:content => chief_descr[:name]}]]
    table table_content, width: bounds.width, :column_widths => [200, 150], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text responsible_descr[:full_name]+" (062) 303-10-45", size: 10
  end
end
