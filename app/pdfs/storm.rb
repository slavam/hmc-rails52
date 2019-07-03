require 'prawn'
class Storm < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, right_margin: 40, left_margin: 80)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.25
    font "OpenSans" #, style: :bold
    bounding_box([0, y_pos], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS, align: :center, size: 9
    end
    
    move_down 90
    text @bulletin.date_hour_minute
    move_down 20
    font "OpenSans", style: :bold
    bounding_box([0, cursor], width: bounds.width) do
      text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 12
    end
    move_down 20
    font "OpenSans"
    # text_box @bulletin.storm, :at => [0, cursor], :width => bounds.width, :height => 300, :overflow => :shrink_to_fit, :indent_paragraphs => 40
    text @bulletin.storm, indent_paragraphs: 40, leading: 4
    move_down 20
    
    table signatures, width: bounds.width, :column_widths => [170,170], cell_style: {:overflow => :shrink_to_fit, size: 11, :inline_format => true } do |t|
      t.cells.border_width = 0
      # t.row(0).size = 11
      # t.column(1).position = :center
    end
    # bounding_box([0, cursor-30], width: bounds.width) do
    #   table signatures, width: bounds.width, column_widths: [220,170], cell_style: {overflow: :shrink_to_fit, inline_format: true } do |t|
    #     t.cells.border_width = 0
    #   end
    # end
    text_box @bulletin.synoptic1 + " (062) 303-10-34", :at => [0, 30], size: 9
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