class Fire < Prawn::Document
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
    move_down 40
    bounding_box([0, cursor], width: bounds.width) do
      text "БЮЛЛЕТЕНЬ ПОЖАРНОЙ ОПАСНОСТИ № #{@bulletin.curr_number}", align: :center, color: "ff0000", size: 12
      text "#{@bulletin.report_date.day} #{I18n.l(@bulletin.report_date, format: "%B")} #{@bulletin.report_date.year} года", align: :center, color: "ff0000", size: 12
    end
    move_down 20
    font "OpenSans"
    text "Информация о фактической пожарной опасности по погодным условиям", align: :center
    text "в Донецкой Народной Республике", align: :center
    text "и прогноз классов пожарной опасности на 1-3 суток", align: :center
  end
end