class AutodorWarning < Prawn::Document
  include HeadersDoc
  def initialize(bulletin)
    super(left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    report_date = @bulletin.report_date
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    
    y_pos = cursor
    font "OpenSans"
    ugms_header
    # bulletin_header(y_pos)
    # stroke do
    #   horizontal_line 0, bounds.width, :at => cursor
    # end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № #{Bulletin.ogmo_code}/"+@bulletin.curr_number
      text "На № 104/24-25/02.01 от 09.12.2024 "
    end
    
    bounding_box([280, y_pos], width: bounds.width-280) do
      text "Директору
            ООО \"АВТОДОР ДОНБАСС\"
		
            Постнову А.А.", leading: 3
    end
    
    move_down 50
    font "OpenSans", style: :bold
    text "ПРЕДУПРЕЖДЕНИЕ О НЕБЛАГОПРИЯТНОМ ЯВЛЕНИИ", align: :center
    font "OpenSans"
    move_down 10
    text @bulletin.forecast_day, leading: 3
    
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    synoptic = @bulletin.synoptic1
                    
    table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]                    
    table table_content, width: bounds.width, :column_widths => [200, 150], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    move_cursor_to 20
    text synoptic +" +7(949) 554-78-30", size: 10
  end
end