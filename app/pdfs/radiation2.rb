class Radiation2 < Prawn::Document
include HeadersDoc
  def initialize(bulletin)
		super(top_margin: 40, right_margin: 50, left_margin: 55)
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
    move_down 30
    font "OpenSans", style: :bold
    bounding_box([50, cursor], :width => 470) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+" № "+@bulletin.curr_number
    end
    move_down 20
    font "OpenSans"
    bounding_box([250, cursor], width: bounds.width-250) do
      text "Начальнику
      Главного управления МЧС России по
      Донецкой Народной Республике

      генерал-лейтенанту внутренней службы
      А.А. Кострубицкому"
    end
    move_down 20
    text "Сообщаем данные наблюдений за радиационным фоном в 09.00 часов", align: :center
    text "#{@bulletin.report_date_as_str}:", align: :center
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    move_down 20
    table [["Метеорологическая станция",	"Дебальцево",	"Донецк", "Амвросиевка",	"Волноваха", "Мариуполь", "Седово"],
            ["мкЗв/ч", 
              "%.2f" % (m_d[0].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[1].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[2].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[3].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[5].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[4].to_i/100.0).to_f.round(2)]], 
            width: bounds.width,:cell_style => { :align => :center, :inline_format => true, size: 9}
    move_down 20
    avg = 0.0
    n = 0
    m_d.each do |md|
      if md.present?
        avg += (md.to_i/100.0).to_f
        n += 1
      end
    end
    avg = "%.2f" % (avg / n.to_f).to_f.round(2) if n > 0
    text "Естественный радиационный фон в Донецкой Народной Республике в среднем составил #{avg} мкЗв/ч."
    bounding_box([0, 300], width: bounds.width) do
      # text "Ответственный за выпуск:"
      table signatures, width: bounds.width, column_widths:  [250, 150], cell_style: {overflow: :shrink_to_fit, inline_format: true } do |t|
        t.cells.border_width = 0
      end
    end
    last_name = @bulletin.synoptic1[0..-6]
    user = User.find_by(last_name: last_name)
    synoptic = user.present? ? user[:last_name]+' '+user[:first_name]+' '+user[:middle_name] : @bulletin.synoptic1 # 'Синоптик'
    text_box synoptic + " +7 (949) 300-73-59", :at => [0, 30], size: 10 #, :width => 170
    move_to 0, 15
    line_to 520, 15
    stroke_color '0000ff'
    stroke
  end
  def signatures
    # chief_descr = @bulletin.chief_2_pdf
    # table_content =[[{:padding => [10,5],:content => chief_descr[:position]}, 
    #   {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, 
    #   {:padding => [10,5],:content => chief_descr[:name]}]]

    responsible_descr = @bulletin.chief.present? ? @bulletin.chief_2_pdf : @bulletin.responsible_2_pdf
    [[responsible_descr[:position], 
      {image: responsible_descr[:image_name], scale: 0.6}, 
      {padding: [20,5], content: responsible_descr[:name]}]]
  end
end
