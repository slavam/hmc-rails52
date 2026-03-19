class Response1 < Prawn::Document
  include HeadersDoc
  def initialize(bulletin)
		super(left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      # :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      # :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    ugms_header_2
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 17} № #{Bulletin.ogmo_code}/"+@bulletin.curr_number
      text "На № _______________ от ______________"
    end

    bounding_box([280, y_pos], width: bounds.width-280) do
      text @bulletin.storm, leading: 3
    end
    ip = Rails.env.production? ? "31.133.32.14" : "10.54.1.6"
    qr_png_path = Bulletin.generate_qr_code_png("http://#{ip}:8080/bulletins/#{@bulletin.id}/qr_check")
    image qr_png_path, at: [0, 560], width: 70, height: 70
    # y_pos = cursor
    # move_down 80
    bounding_box([0, 480], width: bounds.width) do
      text "О предоставлении информации"
    end
    move_down 20
    text @bulletin.forecast_sea_period
    move_down 10
    text "Приложение:"
    text @bulletin.forecast_period
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    signatures = [ 
    [{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
    table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.column(1).position = :center
    end
    chief_descr = @bulletin.chief_2_pdf
    move_down 30
    move_cursor_to 20
    font "OpenSans", style: :normal
    responsible_descr = @bulletin.responsible_2_pdf
    text responsible_descr[:full_name]+" +7(949) 554-78-30", size: 10
  end  
end
