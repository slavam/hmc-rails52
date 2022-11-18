require 'prawn'
class Radiation2 < Prawn::Document
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
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.25
    font "OpenSans", style: :bold
    bounding_box([50, y_pos], :width => 470) do
      text Bulletin::HEAD, align: :center
    end
    move_down 20
    font "OpenSans"
    bounding_box([50, cursor], :width => 470) do
      text Bulletin::ADDRESS, align: :center, size: 10
    end
    move_down 30
    font "OpenSans", style: :bold
    bounding_box([50, cursor], :width => 470) do
      text @bulletin.report_date.strftime("%d.%m.%Y")+" № "+@bulletin.curr_number
    end
    move_down 20
    # image "./app/assets/images/rhumbs.png", at: [0, cursor]
    font "OpenSans" #, style: :italic
    bounding_box([300, cursor], width: bounds.width-300) do
      text "Министру
      по делам гражданской обороны, чрезвычайным ситуациям и ликвидации последствий стихийных бедствий
      Донецкой Народной Республики

      генерал-лейтенанту службы гражданской защиты
      А.А. Кострубицкому"
    end
    move_down 20
    text "Сообщаем данные наблюдений за радиационным фоном в 09.00 часов", align: :center
    text "#{@bulletin.report_date_as_str}:", align: :center
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    move_down 20
    table [["Метеорологическая станция",	"Дебальцево",	"Донецк", "Амвросиевка",	"Волноваха", "Мариуполь", "Седово"],
            # ["мкЗв/ч", m_d[0], m_d[1], m_d[2], m_d[3], m_d[5], m_d[4]]], 
            ["мкЗв/ч", 
              "%.2f" % (m_d[0].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[1].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[2].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[3].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[5].to_i/100.0).to_f.round(2), 
              "%.2f" % (m_d[4].to_i/100.0).to_f.round(2)]], 
            width: bounds.width,:cell_style => { :align => :center, :inline_format => true, size: 9}
    move_down 20
    avg = 0
    n = 0
    m_d.each do |md|
      if md.present?
        # avg += md.to_i
        avg += (md.to_i/100.0).to_f
        n += 1
      end
    end
    avg = (avg / n.to_f).to_f.round(2) if n > 0
    text "Естественный радиационный фон в Донецкой Народной Республике в среднем составил #{avg} мкЗв/ч."
    bounding_box([0, 150], width: bounds.width) do
      text "Ответственный за выпуск:"
      table signatures, width: bounds.width, column_widths:  [300, 100], cell_style: {overflow: :shrink_to_fit, inline_format: true } do |t|
        t.cells.border_width = 0
      end
    end
    last_name = @bulletin.synoptic1[0..-6]
    user = User.find_by(last_name: last_name)
    synoptic = user.present? ? user[:last_name]+' '+user[:first_name]+' '+user[:middle_name] : @bulletin.synoptic1 # 'Синоптик'
    text_box synoptic + " (062) 303-10-34", :at => [0, 30] #, :width => 170
    move_to 0, 15
    line_to 520, 15
    stroke_color '0000ff'
    stroke
  end
  def signatures
    responsible_descr = @bulletin.responsible_2_pdf
    [[responsible_descr[:position], {:image => responsible_descr[:image_name], scale: 0.6}, {:padding => [20,5],:content => responsible_descr[:name]}]]
  end
end
