class Daily < Prawn::Document
  def initialize(bulletin)
		super(top_margin: 30, left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.23
    font "OpenSans"
    bounding_box([0, y_pos], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 15
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS, align: :center, size: 9
    end
    report_date = @bulletin.report_date.to_s(:custom_datetime)
    font "OpenSans", style: :bold
    move_down 20
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
    font "OpenSans", style: :bold
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
      row(1).leading = 2
    end
    move_down 10
    text "Дежурный синоптик #{@bulletin.duty_synoptic}", align: :right
  
    move_down 20
    font "OpenSans", style: :bold
    text "В Донецкой Народной Республике", align: :center
    text @bulletin.header_period, align: :center
    font "OpenSans"
    text @bulletin.forecast_period
  
    move_down 10
    font "OpenSans", style: :bold
    text @bulletin.header_advice, align: :center
    font "OpenSans"
    text @bulletin.forecast_advice
    
    if @bulletin.forecast_orientation.present?
      move_down 10
      font "OpenSans", style: :bold
      text @bulletin.header_orientation, align: :center
      font "OpenSans"
      text @bulletin.forecast_orientation
    end
    move_down 10
    text "Синоптик #{@bulletin.synoptic1}", align: :right
  
    start_new_page(right_margin: 80, left_margin: 30)
    
    font "OpenSans", style: :bold
    text "Приложение к Гидрометеорологическому Бюллетеню", align: :center, :color => "0000FF"
    text "от #{@bulletin.report_date_as_str} № #{@bulletin.curr_number}", align: :center, :color => "0000FF"
    
    move_down 5
    text "МЕТЕОРОЛОГИЧЕСКИЕ ДАННЫЕ", align: :center, :color => "0000FF"
    text @bulletin.header_mdata, align: :center, :color => "0000FF"
    # text "за период с 9.00 часов #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
  
    move_down 5
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
    if @bulletin.summer
      h7 = {content: "Минимальная температура почвы (°C)", rowspan: 2} 
      h8 = {content: "Минимальная относительная влажность воздуха (%)", rowspan: 2}
    else
      h7 = {content: "Высота снежного покрова (см)", rowspan: 2} 
      h8 = {content: "Глубина промерзания (см)", rowspan: 2} 
    end
    stations = ["Донецк", "Дебальцево", "Амвросиевка", "Седово", 
      "Красноармейск", 
      "Волноваха", "Артемовск", "Мариуполь"]
    report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime)
    table_content = 
    [
      [
        {content: "Название метеостанции", valign: :center, rowspan: 2}, 
        {content: "Температура воздуха (°C)", colspan:4},
        {content: "Количество осадков за сутки (мм)", rowspan: 2}, 
        h7, 
        h8, 
        {content: "Максимальная скорость ветра (м/с)", rowspan: 2},
        {content: "Явления погоды", valign: :center, rowspan: 2}, 
      ],
      [
        "<color rgb='ff0000'>Максимальная вчера днем</color>", 
        "<color rgb='0000ff'>Минимальная сегодня ночью</color>", 
        "Средняя за сутки  #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", 
        "В 9.00 часов сегодня", 

      ]
    ]
    table_data = []
    stations.each.with_index do |s, j|
      if (j != 4) and (j != 5) # Pokrovsk, Volnovaha 20210513 KMA
        a = [s]
        (0..8).each do |i| 
          if i==4 and m_d[j*9+4].present? # 20190801 KMA
            if m_d[j*9+4].to_f>1
              m_d[j*9+4] = m_d[j*9+4].to_f.round
            else
              m_d[j*9+4] = m_d[j*9+4].to_s.tr(".",",")
            end
          end
          m_d[i*9+2] = m_d[i*9+2].gsub('.',',') if m_d[i*9+2].present?
          a << ((i!=2 and i!=4 and i!=5 and i!=8 and m_d[j*9+i].present?) ? ((m_d[j*9+i].to_f<0 and m_d[j*9+i].to_f>-0.5) ? '-0' : m_d[j*9+i].to_f.round) : m_d[j*9+i])
        end
        table_data << a
      end
    end
  
    font "OpenSans"
    table table_content, width: bounds.width, :column_widths => [95, 40, 40, 40, 40, 40, 40, 55, 40],:cell_style => { :inline_format => true } do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
      # t.column(0).align = :left
      t.row(1).column(3).background_color = "FFCCCC"
      t.row(0).columns(5..8).rotate = 90
      # t.row(1).height = 100
      t.row(1).rotate = 90
      
      t.before_rendering_page do |p|
        p.row(1).height = 110
      end
      
      # t.row(0).height = 120
      # t.row(0).column(0).valign = :center
      # t.row(0).column(0).align = :center
      # t.row(0).column(9).valign = :center
      # t.row(0).background_color = 'eeeeee'      
      # t.row(0).text_color = "FFFFFF"
    end
    table table_data, width: bounds.width, :column_widths => [95, 40, 40, 40, 40, 40, 40, 55, 40],:cell_style => { :inline_format => true } do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
      t.column(0).align = :left
      t.column(3).background_color = "FFCCCC"
      t.column(9).align = :left
      t.column(9).overflow = :shrink_to_fit
      # t.column(9).size = 8 20190620 Boyko
      # t.column(9).size = 9
      (0..8).each {|i| 
        if (m_d[i*9+8].present? && width_of(m_d[i*9+8], size: 10)>65) # Boyko, KMA 20190628
          t.row(i).column(9).height = 20
        end
      }
      # t.column(9).height = 30 
    end
    
    move_down 10
    font "OpenSans", style: :bold
    text "ОБЗОР ПОГОДЫ И АГРОМЕТЕОРОЛОГИЧЕСКИХ УСЛОВИЙ", align: :center, :color => "0000FF"
    text "в Донецкой Народной Республике", align: :center, :color => "0000FF"
    text @bulletin.header_review, align: :center, :color => "0000FF"
    # review_start_date = @bulletin.review_start_date.present? ? @bulletin.review_start_date : (@bulletin.report_date-1.day)
    # text "за период с 9.00 часов #{review_start_date.strftime("%d")} #{Bulletin::MONTH_NAME2[review_start_date.month]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
    # text "за период с 9.00 часов #{review_start_date.day} #{Bulletin::MONTH_NAME2[review_start_date.month]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
    # text "за период с 9.00 часов #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]} до 9.00 часов #{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]} #{report_date[0,4]} года", align: :center, :color => "0000FF"
    font "OpenSans"
    text @bulletin.agro_day_review  
    
    move_down 5
    font "OpenSans", style: :bold
    c_d = []
    c_d = @bulletin.climate_data.split(";") if @bulletin.climate_data.present?
    month_d = @bulletin.start_month(-1,0)
    text "Климатические данные по г. Донецку за #{report_date_prev[8,2]}#{month_d}-#{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]}", align: :center, :color => "0000FF"
    text "С 1945 по #{report_date[0,4]} гг. по данным Гидрометеорологического центра", align: :center, :color => "0000FF"
    table_content = [["Средняя за сутки температура воздуха (норма)", "#{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", c_d[0].present? ? c_d[0].strip.gsub('.',',')+'°' : '', ""],
                     ["Максимальная температура воздуха", "#{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", c_d[1].present? ? c_d[1].strip.gsub('.',',')+'°' : '', "отмечалась в #{c_d[2].strip} г."],
                     ["Минимальная температура воздуха", "#{report_date[8,2]} #{Bulletin::MONTH_NAME2[report_date[5,2].to_i]}", c_d[3].present? ? c_d[3].strip.gsub('.',',')+'°' : '', "отмечалась в #{c_d[4].strip} г."]]
    font "OpenSans"
    table table_content, width: bounds.width , cell_style: {:overflow => :shrink_to_fit, size: 10} do |t|
      t.cells.padding = [2, 2]
    end
    move_down 5

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