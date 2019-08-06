class DailyShort < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 40, left_margin: 80, right_margin: 50)
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
    report_date = @bulletin.report_date.to_s(:custom_datetime)
    font "OpenSans", style: :bold
    move_down 40
    bounding_box([0, cursor], width: bounds.width) do
      text "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number}", :color => "0000FF", align: :center
      text @bulletin.report_date_as_str, :color => "0000FF", align: :center
    end

    if @bulletin.storm.present?
      bounding_box([0, cursor-10], :width => bounds.width) do
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, :color => "ff0000"
        font "OpenSans"
        move_down 10
        text @bulletin.storm, indent_paragraphs: 40, leading: 2
      end
    end
    move_down 10
    report_date_next = (@bulletin.report_date + 1.day).to_s(:custom_datetime)
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width, :height => 30) do
      # stroke_bounds
      text "Прогноз погоды", align: :center, size: 14, :color => "0000FF"
      text "на сутки с 21 часа #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} до 21 часа #{report_date_next[8,2]} #{Bulletin::MONTH_NAME2[report_date_next[5,2].to_i]} #{report_date_next[0,4]} года", align: :center, :color => "0000FF"
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
      row(1).leading = 2
    end
    move_down 10
    text "Дежурный синоптик #{@bulletin.duty_synoptic}", align: :right
  
    move_down 20
    report_date_next2 = (@bulletin.report_date + 2.day).to_s(:custom_datetime)
    report_date_next3 = (@bulletin.report_date + 3.day).to_s(:custom_datetime)
    font "OpenSans", style: :bold
    month_p = @bulletin.start_month(2,3)
    text "Периодный прогноз погоды на #{report_date_next2[8,2]}#{month_p}-#{report_date_next3[8,2]} #{Bulletin::MONTH_NAME2[report_date_next3[5,2].to_i]} #{report_date_next3[0,4]} года", align: :center
    text "в Донецкой Народной Республике", align: :center
    font "OpenSans"
    text @bulletin.forecast_period
  
    move_down 10
    report_date_next4 = (@bulletin.report_date + 4.day).to_s(:custom_datetime)
    report_date_next5 = (@bulletin.report_date + 5.day).to_s(:custom_datetime)
    font "OpenSans", style: :bold
    month_k = @bulletin.start_month(4,5)
    text "Консультативный прогноз погоды на #{report_date_next4[8,2]}#{month_k}-#{report_date_next5[8,2]} #{Bulletin::MONTH_NAME2[report_date_next5[5,2].to_i]} #{report_date_next5[0,4]} года", align: :center
    text "в Донецкой Народной Республике", align: :center
    font "OpenSans"
    text @bulletin.forecast_advice
    
    if @bulletin.forecast_orientation.present?
      move_down 10
      report_date_next6 = (@bulletin.report_date + 6.day).to_s(:custom_datetime)
      # report_date_next11 = (@bulletin.report_date + 11.day).to_s(:custom_datetime) 20190610 KMA
      report_date_next11 = (@bulletin.report_date + 10.day).to_s(:custom_datetime)
      font "OpenSans", style: :bold
      month_o = @bulletin.start_month(6,10)
      text "Ориентировочный прогноз погоды на #{report_date_next6[8,2]}#{month_o}-#{report_date_next11[8,2]} #{Bulletin::MONTH_NAME2[report_date_next11[5,2].to_i]} #{report_date_next11[0,4]} года", align: :center
      text "в Донецкой Народной Республике", align: :center
      font "OpenSans"
      text @bulletin.forecast_orientation
    end
    move_down 10
    text "Синоптик #{@bulletin.synoptic1}", align: :right
  
    start_new_page(right_margin: 80, left_margin: 30)
    font "OpenSans", style: :bold
    text "Приложение к Гидрометеорологическому Бюллетеню", align: :center, :color => "0000FF"
    text "от #{@bulletin.report_date_as_str} № #{@bulletin.curr_number}", align: :center, :color => "0000FF"
    
    move_down 10
    report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime) 
    move_down 10
    font "OpenSans", style: :bold
    text "ОБЗОР ПОГОДЫ И АГРОМЕТЕОРОЛОГИЧЕСКИХ УСЛОВИЙ", align: :center, :color => "0000FF"
    text "в Донецкой Народной Республике", align: :center, :color => "0000FF"
    review_start_date = @bulletin.review_start_date.present? ? @bulletin.review_start_date : (@bulletin.report_date-1.day)
    text "за период с 9.00 часов #{review_start_date.strftime("%d")} #{Bulletin::MONTH_NAME2[review_start_date.month]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
    # text "за период с 9.00 часов #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
    font "OpenSans"
    text @bulletin.agro_day_review  
    
    move_down 10
    font "OpenSans", style: :bold
    c_d = []
    c_d = @bulletin.climate_data.split(";") if @bulletin.climate_data.present?
    month_d = @bulletin.start_month(-1,0)
    text "Климатические данные по г. Донецку за #{report_date_prev[8,2]}#{month_d}-#{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]}", align: :center, :color => "0000FF"
    text "С 1945 по #{report_date[0,4]} гг. по данным Гидрометеорологического центра", align: :center, :color => "0000FF"
    table_content = [["Средняя за сутки температура воздуха (норма)", "#{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", c_d[0].present? ? c_d[0].strip+'°' : '', ""],
                     ["Максимальная температура воздуха", "#{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", c_d[1].present? ? c_d[1].strip+'°' : '', "отмечалась в #{c_d[2].strip} г."],
                     ["Минимальная температура воздуха", "#{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]}", c_d[3].present? ? c_d[3].strip+'°' : '', "отмечалась в #{c_d[4].strip} г."]]
    font "OpenSans"
    table table_content, width: bounds.width , cell_style: {:overflow => :shrink_to_fit, size: 10} do |t|
      t.cells.padding = [2, 2]
    end
    move_down 10

    bounding_box([5, cursor], :width => bounds.width) do
      text "Время выпуска 13:00", size: 9
    end
    table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(2).size = 11
      t.column(1).position = :center
      # t.row(2).valign = :center
    end
  end  
  def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    [ ["Ответственный за выпуск:","",""],
      [responsible_descr[:position], {:image => responsible_descr[:image_name], scale: 0.6, :vposition => :center}, {:padding => [16,5],:content => responsible_descr[:name]}],
      [{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
  end
end