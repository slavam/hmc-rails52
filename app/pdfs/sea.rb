# require 'prawn'
class Sea < Prawn::Document
  MONTH_NAME2 = %w{nil января февраля марта апреля мая июня июля августа сентября октября ноября декабря}
	def initialize(bulletin)
		# super(top_margin: 30)	
		super(top_margin: 30, left_margin: 80, right_margin: 50)
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
      text "МОРСКОЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number} 
      #{@bulletin.report_date_as_str}", :color => "0000FF", align: :center, size: 12
    end
    move_down 20
    if @bulletin.storm.present?
      bounding_box([0, cursor], width: bounds.width) do
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, color: "ff0000"
        font "OpenSans"
        text @bulletin.storm, indent_paragraphs: 40, leading: 4
      end
    end
    move_down 10
    # report_date_next = (@bulletin.report_date + 1.day).to_s(:custom_datetime)
    # font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width) do
      text "ПРОГНОЗ ПОГОДЫ", align: :center
      text @bulletin.header_daily, align: :center
      # на сутки с 21 часа #{report_date[8,2]} #{MONTH_NAME2[report_date[5,2].to_i]} до 21 часа #{report_date_next[8,2]} #{MONTH_NAME2[report_date_next[5,2].to_i]} #{report_date_next[0,4]} года", align: :center, :color => "0000FF"
    end
    font "OpenSans"
    move_down 10
    table weather_forecast, width: bounds.width, cell_style: { padding: 3, border_width: 0, :border_color => "000000", :inline_format => true} do
      row(0).borders = [:bottom]
      row(0).border_width = 1
      column(0).borders = [:right]
      column(0).border_width = 1
      row(0).column(0).borders = [:bottom, :right]
      row(1).leading = 4
    end
    move_down 25
    # report_date_next2 = (@bulletin.report_date + 2.day).to_s(:custom_datetime)
    # report_date_next3 = (@bulletin.report_date + 3.day).to_s(:custom_datetime)
    font "OpenSans", style: :bold
    # month_p = @bulletin.start_month(2,3)
    # text "Периодный прогноз погоды на #{report_date_next2[8,2]}#{month_p}-#{report_date_next3[8,2]} #{MONTH_NAME2[report_date_next3[5,2].to_i]} #{report_date_next3[0,4]} года
    text @bulletin.header_period, align: :center
    text "По акватории Азовского моря (на участке с. Безыменное – пгт. Седово)", align: :center #, color: "0000ff"
    font "OpenSans"
    move_down 10
    text @bulletin.forecast_period, :leading => 4
    move_down 10
    text "Синоптик #{@bulletin.synoptic1}", align: :right
    
    # start_new_page layout: :landscape
    start_new_page(layout: :landscape, right_margin: 30, left_margin: 30) #, top_margin: 50)
    font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    text "Приложение к Морскому Гидрометеорологическому Бюллетеню
    от #{@bulletin.report_date_as_str} № #{@bulletin.curr_number}", align: :center, :color => "0000FF"
    text "МЕТЕОРОЛОГИЧЕСКИЕ ДАННЫЕ И СВЕДЕНИЯ О СОСТОЯНИИ МОРЯ", align: :center, :color => "0000FF"
    move_down 10
    font "OpenSans"
    if @bulletin.summer
      head_col_widths = [70,40,40,40,40,40,40,80,50,50,40,40,40]
      data_col_widths = [70,45,46,45,46,45,46,80,50,50,40,40,40, 89]
    else
      head_col_widths = [70,40,40,40,40,40,40,40,80,50,50,40,40]
      data_col_widths = [70,45,45,45,45,45,45,45,80,50,50,40,40, 87]
    end
    table meteo_head, width: bounds.width, column_widths: head_col_widths, cell_style: {border_width: 0.5, :inline_format => true, size: 9} do |t|
      t.cells.padding = 1
      t.cells.rows(0..1).padding = [-5,2,2,2]
      t.cells.align = :center
      t.row(0).height = 17
      t.cells.row(0).valign = :center
      t.row(1).height = 17
      t.row(2).rotate = 90
      t.cells.row(2).padding = [1, 10]
      
      t.before_rendering_page do |p|
        p.row(2).height = 90
      end
    end
    
    table meteo_data, width: bounds.width, column_widths: data_col_widths, cell_style: {border_width: 0.5, :inline_format => true, size: 9} do |t|
      t.cells.padding = 1
      t.cells.align = :center
      t.before_rendering_page do |p|
        if !@bulletin.summer
          p.row(0).column(13).width = 99 
          p.row(1).column(13).width = 99
          p.row(2).column(13).width = 99
          p.row(3).column(13).width = 99
        end
      end
      if @bulletin.summer
        t.row(0).column(7).align = :left
        t.row(0).column(7).overflow = :shrink_to_fit
      else
        t.row(0).column(8).align = :left
        t.row(0).column(8).overflow = :shrink_to_fit
      end
      t.row(0).height = 17
      t.rows(0..3).size = 11
      t.row(3).align = :left
      t.row(3).leading = 4
      t.row(3).padding = 7
    end
    move_down 10
    bounding_box([5, cursor], :width => bounds.width) do
      text "Время выпуска 13:00", size: 11
    end
    move_down 10
    table signatures, width: bounds.width, :column_widths => [270, 300], cell_style: {:overflow => :shrink_to_fit, size: 11, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(2).size = 12
      t.column(1).position = :center
      # t.row(2).valign = :center
    end
	end
	
	def weather_forecast
		[ [{:content => "<b>По акватории Азовского моря (на участке с. Безыменное – пгт. Седово)</b>", :align => :center}, {:content => "<b>По г. Новоазовску, пгт. Седово</b>", :align => :center}],
      [@bulletin.forecast_day, @bulletin.forecast_day_city]]
	end
	def meteo_head
	  if @bulletin.summer
	    colspan1 = 7
	    colspan2 = 6
	    head_row01 = 
	    [
	      {content:'Температура воздуха (°C)', colspan:3, valign: :center},
	      {content:"
	      Количество осадков 
	      за сутки (мм)", rowspan:2, rotate: 90},
	      {content:'Ветер', colspan:2, valign: :center},
	      {content:"Явления погоды", rowspan:2, valign: :center}, 
	      {content:'Уровень моря (см)', colspan:2, valign: :center},
	      {content:"
	      Температура воды 
	      (°C)", rowspan:2, rotate: 90}, 
	      {content:'Волнение', colspan:2, valign: :center},
  	    {content:"Видимость", rowspan:2, valign: :center},
	    ]
	    head_row1 = 
	    [
  	    "<color rgb='ff0000'>Максимальная вчера днем</color>", 
  	    "<color rgb='0000ff'>Минимальная сегодня ночью</color>", 
  	    "В 9.00 часов сегодня", 
  	    "Направление", 
  	    "Максимальная скорость (м/с)", 
  	    "Над '0' поста", 
  	    "Повышение (+), понижение (-) за сутки", 
  	    "Направление", 
  	    "Высота (дм)"
	    ]
	  else
	    colspan1 = 8
	    colspan2 = 5
	    head_row01 = 
	    [
	      {content:'Температура воздуха (°C)', colspan:3, valign: :center},
	      {content:"
	      Количество осадков 
	      за сутки (мм)", rowspan:2, rotate: 90},
	      {content:"
	      Высота снежного покрова (см)", rowspan:2, rotate: 90},
	      {content:'Ветер', colspan:2, valign: :center},
	      {content:"Явления погоды", rowspan:2, valign: :center}, 
	      {content:'Уровень моря (см)', colspan:2, valign: :center},
	      {content:"
	      Температура воды 
	      (°C)", rowspan:2, rotate: 90}, 
  	    {content:"
  	    Видимость", rowspan:2, rotate: 90},
  	    {content:"Ледовое состояние", rowspan:2, valign: :center},
	    ]
	    head_row1 = [
	    "<color rgb='ff0000'>Максимальная вчера днем</color>", 
	    "<color rgb='0000ff'>Минимальная сегодня ночью</color>", 
	    "В 9.00 часов сегодня", 
	    "Направление", 
	    "Максимальная скорость (м/с)", 
	    "Над '0' поста", 
	    "Повышение (+), понижение (-) за сутки"
	    ]
	  end
    report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime)
	  [
	    [
	     # '','','','','','','','','','','','','',''
	      {content: "Название метеостанции", rowspan: 3}, #, width: 70}, 
	      {content: @bulletin.header_mdata, valign: :center, colspan: colspan1},
	     # {content: "за период с 9.00 часов #{report_date_prev[8,2]} #{MONTH_NAME2[report_date_prev[5,2].to_i]} до 9.00 часов #{@bulletin.report_date_as_str}", 
	       # valign: :center, colspan: colspan1},
	      {content: "в срок 9.00 часов #{@bulletin.report_date_as_str}", colspan: colspan2, valign: :center}
	    ],
	   # ['','','','','','','','','','','','','',''],
	    head_row01,
	    head_row1,
	  ]
	end
	
	def meteo_data
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
	  if @bulletin.summer
	    colspan3 = 8
	    colspan4 = 6
	    [0,1,2,9].each{|i| m_d[i] = m_d[i].to_f.round if m_d[i].present?}
	    data_row = ['Седово', m_d[0], m_d[1], m_d[2], m_d[3], m_d[4], m_d[5], m_d[6], m_d[7], m_d[8], m_d[9], m_d[10], m_d[11], m_d[12]]
    else
	    colspan3 = 9
	    colspan4 = 5
	    [0,1,2,9].each{|i| m_d[i] = m_d[i].to_f.round if m_d[i].present?}
	    data_row = ['Седово', m_d[0], m_d[1], m_d[2], m_d[3], m_d[13], m_d[4], m_d[5], m_d[6], m_d[7], m_d[8], m_d[9], m_d[12], m_d[14]]
	  end
    # review_start_date = @bulletin.review_start_date.present? ? @bulletin.review_start_date.to_s(:custom_datetime) : (@bulletin.report_date-1.day).to_s(:custom_datetime)
	  [
	    data_row,
	    [
	      {content: "<color rgb='0000ff'>ОБЗОР ПОГОДЫ</color>", colspan: colspan3},
	      {content: "<color rgb='0000ff'>ОБЗОР СОСТОЯНИЯ АЗОВСКОГО МОРЯ</color>", colspan: colspan4}
	    ],
	    [
	      {content: @bulletin.header_mdata, colspan: 14}
	     # {content: "за период с 9.00 часов #{review_start_date[8,2]} #{MONTH_NAME2[review_start_date[5,2].to_i]} до 9.00 часов #{@bulletin.report_date_as_str}", 
  	   #   colspan: 14}
	    ],
	    [
	      {content: @bulletin.forecast_sea_day, colspan: colspan3},
	      {content: @bulletin.forecast_sea_period, colspan: colspan4}
	    ]
    ]
	end
	def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    [ ["Ответственный за выпуск:","",""],
      [responsible_descr[:position], {:image => responsible_descr[:image_name], scale: 0.6, :vposition => :center}, {:padding => [16,5],:content => responsible_descr[:name]}],
      [{:padding => [10,5],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),:image => chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
	end
end