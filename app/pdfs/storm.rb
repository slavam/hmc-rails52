class Storm < Prawn::Document
include HeadersDoc
  def initialize(bulletin, variant)
		super(top_margin: 40, right_margin: 40, left_margin: 80)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    bulletin_header(y_pos)

    move_down 20 #90
    text @bulletin.date_hour_minute
    move_down 20
    font "OpenSans", style: :bold
    warning = "ПРЕДУПРЕЖДЕНИЕ"
    if variant == 'notification'
      warning = 'ОПОВЕЩЕНИЕ'
    end
    bounding_box([0, cursor], width: bounds.width) do
      if @bulletin.curr_number.size < 10
        text "ШТОРМОВОЕ #{warning} № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 13
      else
        text "#{@bulletin.curr_number}", align: :center, color: "ff0000", size: 13
      end
    end
    move_down 20
    font "OpenSans"
    text @bulletin.storm, indent_paragraphs: 40, leading: 4
    move_down 20
    # 20190709 одинаковый размер шрифта КМА
    table signatures, width: bounds.width, :column_widths => [170,170], cell_style: {:overflow => :shrink_to_fit, :inline_format => true } do |t|
      t.cells.border_width = 0
    end
    text_box @bulletin.synoptic1 + " +7 (949) 300-7359", :at => [0, 30], size: 9
    image "./app/assets/images/storm.png", at: [380, 100], :scale => 0.75
    move_to 0, 15
    line_to 500, 15
    stroke_color '0000ff'
    stroke
  end
  def signatures
	  chief_descr = @bulletin.chief_2_pdf
	  [[{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6, position: :center}, {:padding => [10,5],:content => chief_descr[:name]}]]
    # [[chief_descr[:position], {padding: -5, position: :center, image: chief_descr[:image_name], scale: 0.6}, chief_descr[:name]]]
  end
end
