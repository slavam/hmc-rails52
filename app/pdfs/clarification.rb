class Clarification < Prawn::Document
include HeadersDoc
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 80, right_margin: 50, bottom_margin: 0)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    font "OpenSans"
    bulletin_header(cursor)
    # move_down 20
    # bounding_box([0, cursor], width: bounds.width) do
    #   # text Bulletin::HEAD, align: :center, size: 10
    #   text Bulletin::HEAD1, align: :center, size: 10
    #   text Bulletin::HEAD2, align: :center, size: 10, style: :bold
    #   text Bulletin::HEAD3, align: :center, size: 10
    # end
    # move_down 10
    # font "OpenSans" #, style: :italic
    # bounding_box([0, cursor], width: bounds.width) do
    #   text Bulletin::ADDRESS, align: :center, size: 10
    # end
    # move_down 10
    # stroke do
    #   horizontal_line 0, bounds.width, :at => cursor
    # end
    move_down 10
    font "OpenSans", style: :normal
    # y_pos = cursor
    text "#{@bulletin.report_date.strftime("%d.%m.%Y")} № #{@bulletin.curr_number}-у"
    move_down 10
    report_date = @bulletin.report_date.strftime("%Y-%m-%d")
    text "УТОЧНЕНИЕ ПРОГНОЗА ПОГОДЫ", align: :center
    text "на день с 09.00 до 21.00 часа #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center
    move_down 20
    text "В Донецкой Народной Республике"
    text @bulletin.forecast_day
    move_down 20
    text "В городе Донецке"
    text @bulletin.forecast_day_city
    move_down 20
    text "В 07.00 часов в Донецке:"
    text @bulletin.forecast_period
    move_down 20
    chief_descr = @bulletin.chief_2_pdf
    table_content =[[{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
    table table_content, width: bounds.width, :column_widths => [200, 170], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    text_box @bulletin.synoptic1 + " (062) 303-10-34", :at => [0, 30], size: 9
  end
end
