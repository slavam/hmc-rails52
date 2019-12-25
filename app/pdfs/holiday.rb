class Holiday < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 80, right_margin: 40)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.25
    font "OpenSans"
    bounding_box([0, y_pos], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS, align: :center, size: 9
    end
    move_down 40
    report_date = @bulletin.report_date.to_s(:custom_datetime)
    font "OpenSans", style: :bold
    bounding_box([0, cursor], width: bounds.width) do
      text "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number}", :color => "0000FF", align: :center
      text @bulletin.report_date_as_str, :color => "0000FF", align: :center
    end
    if @bulletin.storm.present?
      bounding_box([0, cursor-10], :width => bounds.width) do
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, :color => "ff0000"
        font "OpenSans"
        move_down 10
        text @bulletin.storm, indent_paragraphs: 40, leading: 4
      end
    end
    
    font "OpenSans", style: :bold
    move_down 20
    bounding_box([0, cursor], :width => bounds.width, :height => 30) do
      text "Прогноз погоды", align: :center
      text @bulletin.header_daily, align: :center
    end
    
    font "OpenSans"
    move_down 10
    table_content = [["<b>В Донецкой Народной Республике</b>", "<b>В городе Донецке</b>"],
                    [@bulletin.forecast_day, @bulletin.forecast_day_city]]
    table table_content, width: bounds.width, cell_style: { padding: 3, border_width: 0, border_color: "000000", inline_format: true} do
      row(0).borders = [:bottom]
      row(0).border_width = 1
      row(0).align = :center
      column(0).borders = [:right]
      column(0).border_width = 1
      row(0).column(0).borders = [:bottom, :right]
      row(1).leading = 4
    end
    move_down 10
    text "Дежурный синоптик #{@bulletin.duty_synoptic}", align: :right
  
    move_down 20
    font "OpenSans", style: :bold
    text @bulletin.header_period, align: :center
    text "в Донецкой Народной Республике", align: :center
    font "OpenSans"
    move_down 10
    text @bulletin.forecast_period, leading: 4

    move_down 10
    text "Синоптик #{@bulletin.synoptic1}", align: :right
    
    move_to 0, 15
    line_to bounds.width, 15
    stroke_color '0000ff'
    stroke
  end
end