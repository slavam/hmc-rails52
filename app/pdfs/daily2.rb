class Daily2 < Prawn::Document
  include HeadersDoc
  def initialize(bulletin, num_pages)
		super(left_margin: 80, right_margin: 50)
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    ugms_header_gmc
    # bulletin_header(y_pos)
    # image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.23
    # image "./app/assets/images/roshydromet.png", :scale => 0.085 #, at: [0, y_pos-50]
    # bounding_box([85, y_pos], width: bounds.width-85) do
    #   text Bulletin::HEAD1, align: :center, size: 10
    #   text Bulletin::HEAD2, align: :center, size: 10, style: :bold
    #   text Bulletin::HEAD3, align: :center, size: 10
    #   text Bulletin::ADDRESS, align: :center, size: 9
    # end
    report_date = @bulletin.report_date.to_s(:custom_datetime)
    font "OpenSans", style: :bold
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text "ЕЖЕДНЕВНЫЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number}", :color => "0000FF", align: :center
      text @bulletin.report_date_as_str, :color => "0000FF", align: :center
    end
    if @bulletin.storm.present?
      bounding_box([0, cursor-10], :width => bounds.width) do
        text "ПРЕДУПРЕЖДЕНИЯ ОБ ОПАСНЫХ ЯВЛЕНИЯХ И НЕБЛАГОПРИЯТНЫХ ГИДРОМЕТЕОРОЛОГИЧЕСКИХ УСЛОВИЯХ", align: :center, :color => "ff0000"
        font "OpenSans"
        move_down 10
        text @bulletin.storm
      end
    end
    move_down 10
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width, :height => 30) do
      text "Прогноз погоды", align: :center
      text @bulletin.header_daily, align: :center
    end
    font "OpenSans"
    bounding_box([0, cursor], :width => bounds.width) do
      text "В городе Донецке", style: :bold
      text @bulletin.forecast_day_city
    end
    move_down 10
    bounding_box([0, cursor], :width => bounds.width) do
      text "В Донецкой Народной Республике", style: :bold
      text @bulletin.forecast_day
    end
    move_down 10
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width, :height => 30) do
      text "Прогноз погоды", align: :center
      text @bulletin.header_period, align: :center
    end
    font "OpenSans"
    bounding_box([0, cursor], :width => bounds.width) do
      text "В городе Донецке", style: :bold
      text @bulletin.forecast_sea_period
    end
    move_down 10
    bounding_box([0, cursor], :width => bounds.width) do
      text "В Донецкой Народной Республике", style: :bold
      text @bulletin.forecast_period
    end
    move_down 10
    text "Дежурный синоптик #{@bulletin.synoptic1}", align: :right

    start_new_page(right_margin: 50, left_margin: 80)
    yesterday = @bulletin.report_date-1
    move_down 20
    font "OpenSans", style: :bold
    text "ОБЗОР НЕБЛАГОПРИЯТНЫХ И ОПАСНЫХ МЕТЕОРОЛОГИЧЕСКИХ ЯВЛЕНИЙ ПРОШЕДШИХ СУТОК", align: :center
    text "с 06 часов #{'%02d' % yesterday.day} #{Bulletin::MONTH_NAME2[yesterday.month]} #{yesterday.year} до 06 часов #{'%02d' % @bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center
    font "OpenSans"
    text @bulletin.forecast_advice
    move_down 20
    font "OpenSans", style: :bold
    text "ГИДРОЛОГИЧЕСКИЙ ОБЗОР", align: :center
    text "с 06 часов #{'%02d' % yesterday.day} #{Bulletin::MONTH_NAME2[yesterday.month]} #{yesterday.year} до 06 часов #{'%02d' % @bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year} года", align: :center
    font "OpenSans"
    text @bulletin.forecast_orientation
    move_down 20
    font "OpenSans", style: :bold
    text "ОБЗОР СЛОЖИВШИХСЯ НЕБЛАГОПРИЯТНЫХ И ОПАСНЫХ АГРОМЕТЕОРОЛОГИЧЕСКИХ ЯВЛЕНИЙ", align: :center
    font "OpenSans"
    text @bulletin.forecast_sea_day
    move_down 20
    font "OpenSans", style: :bold
    text "ИНФОРМАЦИЯ ПО МОНИТОРИНГУ ЗАГРЯЗНЕНИЯ ОКРУЖАЮЩЕЙ СРЕДЫ", align: :center
    font "OpenSans"
    text "По данным измерений метеостанций на территории Донецкой Народной Республики мощность амбиентного эквивалента дозы гамма-излучения (МАЭД) на 09:00 часов "+
      "<b>#{'%02d' % @bulletin.report_date.day} #{Bulletin::MONTH_NAME2[@bulletin.report_date.month]} #{@bulletin.report_date.year}</b>"+
      " года составляет <b>#{format('%.2f',(@bulletin.storm_hour.to_f/100).round(2))}-#{format('%.2f',(@bulletin.storm_minute.to_f/100).round(2))} мкЗв/ч</b>, что не превышает естественный радиационный фон данной местности.", inline_format: true
    if num_pages == 'all_pages'
      start_new_page(right_margin: 50, left_margin: 80)
      font "OpenSans", style: :bold
      text "Приложение к Гидрометеорологическому Бюллетеню", align: :center, :color => "0000FF"
      text "от #{@bulletin.report_date_as_str} № #{@bulletin.curr_number}", align: :center, :color => "0000FF"
      
      move_down 5
      text "МЕТЕОРОЛОГИЧЕСКИЕ ДАННЫЕ", align: :center, :color => "0000FF"
      text @bulletin.header_mdata, align: :center, :color => "0000FF"
    
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
      report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime)
      table_content = 
      [
        [
          {content: "Название метеостанции", valign: :center, rowspan: 2}, 
          {content: "Температура воздуха (°C)", colspan:3},
          {content: "Количество осадков за день (мм)", rowspan: 2}, 
          {content: "Количество осадков за ночь (мм)", rowspan: 2}, 
          h7, 
          h8, 
          {content: "Максимальная скорость ветра (м/с)", rowspan: 2},
          {content: "Явления погоды", valign: :center, rowspan: 2}, 
        ],
        [
          "<color rgb='ff0000'>Максимальная вчера днем</color>", 
          "<color rgb='0000ff'>Минимальная сегодня ночью</color>", 
          "Средняя за сутки  #{report_date_prev[8,2]} #{Bulletin::MONTH_NAME2[report_date_prev[5,2].to_i]}", 
        ]
      ]
      table_data = []
      is_dnr = true #false #@bulletin.report_date > Time.parse("2022-05-17")
      stations = is_dnr ? ["Дебальцево", "Донецк", "Амвросиевка", "Волноваха", "Мариуполь", "Седово"] :
        ["Донецк", "Дебальцево", "Амвросиевка", "Седово", "Красноармейск", "Волноваха", "Артемовск", "Мариуполь"]

      stations.each.with_index do |s, j|
        a = [s]
        row = j #is_dnr ? num_row.index(j) : j
        (0..8).each do |i|
          a << m_d[row*9+i]
          # a << ((i==3 or i==4) and m_d[row*9+i].present? and m_d[row*9+i]=='0.0') ? '': m_d[row*9+i]
          #   ((m_d[row*9+i].to_f<0 and m_d[row*9+i].to_f>-0.5) ? '-0' : m_d[row*9+i].to_f.round) : 
          #   m_d[row*9+i])
        end
        table_data << a
      end
      
      font "OpenSans"
      table table_content, width: bounds.width, :column_widths => [95, 40, 40, 40, 40, 40, 40, 40, 40],:cell_style => { :inline_format => true } do |t|
        t.cells.padding = [1, 1]
        t.cells.align = :center
        t.row(1).column(3).background_color = "FFCCCC"
        t.row(0).columns(4..8).rotate = 90
        t.row(1).rotate = 90
        t.before_rendering_page do |p|
          p.row(1).height = 110
        end
      end
      table table_data, width: bounds.width, :column_widths => [95, 40, 40, 40, 40, 40, 40, 40, 40],:cell_style => { :inline_format => true } do |t|
        t.cells.padding = [1, 1]
        t.cells.align = :center
        t.column(0).align = :left
        t.column(3).background_color = "FFCCCC"
        t.column(9).align = :left
        t.column(9).overflow = :shrink_to_fit
        (0..7).each {|i| 
          if (m_d[i*9+8].present? && width_of(m_d[i*9+8], size: 10)>65) # Boyko, KMA 20190628
            if t.row(i).present? && t.row(i).column(9).present?
              t.row(i).column(9).height = 20
            end
          end
        }
      end
    end
    
    report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime)
    
    # move_down 5
    font "OpenSans", style: :bold
    # c_d = []
    c_d = ['1','2','3','4','5','6','7']
    c_d = @bulletin.climate_data.split(";") if @bulletin.climate_data.present?
    month_d = @bulletin.start_month(-1,0)
    move_down 20
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

    table signatures, width: bounds.width, :column_widths => [220,170], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(2).size = 11
      t.column(1).position = :center
    end
  end  
  def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    move_down 10
    [ ["Ответственный за выпуск:","",""],
      [responsible_descr[:position], {:image => responsible_descr[:image_name], scale: 0.6, :vposition => :center}, {:padding => [16,5],:content => responsible_descr[:name]}],
      [{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
  end
end
