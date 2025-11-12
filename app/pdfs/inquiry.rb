class Inquiry < Prawn::Document
  include HeadersDoc
  def initialize(bulletin)
    super(left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    y_pos = cursor
    font "OpenSans"
    ugms_header_2
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № #{Bulletin.ogmo_code}/"+@bulletin.curr_number
      text "На № #{@bulletin.forecast_day}"
    end
    
    bounding_box([280, y_pos], width: bounds.width-280) do
      text "#{@bulletin.storm}
		
            #{@bulletin.forecast_day_city}", leading: 3
    end
    
    move_down 50
    # font "OpenSans", style: :bold
    text "О предоставлении информации", align: :left
    move_down 20
    font "OpenSans"
    text @bulletin.forecast_sea_period
    move_down 5
    text "Приложение:", align: :left
    # move_down 10
    text @bulletin.forecast_period, leading: 3
    move_down 10
    ip = Rails.env.production? ? "31.133.32.14" : "10.54.1.6"
    qr_png_path = Bulletin.generate_qr_code_png("http://#{ip}:8080/bulletins/#{@bulletin.id}/qr_check")
    image qr_png_path, at: [0, 230], width: 80, height: 80
    move_down 10
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