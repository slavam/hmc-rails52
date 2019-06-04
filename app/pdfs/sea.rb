require 'prawn'
class Sea < Prawn::Document
  MONTH_NAME2 = %w{nil января февраля марта апреля мая июня июля августа сентября октября ноября декабря}
	def initialize(bulletin)
		super(top_margin: 30)		
		@bulletin = bulletin
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    image "./app/assets/images/logo.jpg", at: [0, y_pos], :scale => 0.25
    # font "./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"
    font "OpenSans"
    bounding_box([50, y_pos], :width => 470) do
        text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 20
    # font "./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"
    bounding_box([50, cursor], :width => 470) do
        text Bulletin::ADDRESS, align: :center, size: 9
    end
    report_date = @bulletin.report_date.to_s(:custom_datetime)
    # font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    font "OpenSans", style: :bold
    move_down 40
    bounding_box([50, cursor], :width => 470) do
      text "МОРСКОЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ БЮЛЛЕТЕНЬ № #{@bulletin.curr_number} 
      #{@bulletin.report_date_as_str}", :color => "0000FF", align: :center, size: 13
    end
    move_down 20
    if @bulletin.storm.present?
      bounding_box([0, cursor], width: bounds.width) do
        text "ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ", align: :center, color: "ff0000"
        font "./app/assets/fonts/OpenSans/OpenSans-Light.ttf"
        text @bulletin.storm
      end
    end
    move_down 10
    report_date_next = (@bulletin.report_date + 1.day).to_s(:custom_datetime)
    # font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    font "OpenSans", style: :bold
    bounding_box([0, cursor], :width => bounds.width) do
      text "ПРОГНОЗ ПОГОДЫ
      на сутки с 21 часа #{report_date[8,2]} #{MONTH_NAME2[report_date[5,2].to_i]} до 21 часа #{report_date_next[8,2]} #{MONTH_NAME2[report_date_next[5,2].to_i]} #{report_date_next[0,4]} года", align: :center, :color => "0000FF"
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
    move_down 20
    report_date_next2 = (@bulletin.report_date + 2.day).to_s(:custom_datetime)
    report_date_next3 = (@bulletin.report_date + 3.day).to_s(:custom_datetime)
    font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    text "Периодный прогноз погоды на #{report_date_next2[8,2]}-#{report_date_next3[8,2]} #{MONTH_NAME2[report_date_next3[5,2].to_i]} #{report_date_next3[0,4]} года
    По акватории Азовского моря (на участке с. Безыменное – пгт. Седово)", align: :center, color: "0000ff"
    font "OpenSans"
    move_down 10
    text @bulletin.forecast_period, :leading => 4
    move_down 10
    text "Синоптик #{@bulletin.synoptic1}", align: :right
    
    start_new_page layout: :landscape
    font "./app/assets/fonts/DejaVu/DejaVuSansCondensed-Bold.ttf"
    text "Приложение к Морскому Гидрометеорологическому Бюллетеню
    от #{@bulletin.report_date_as_str} № #{@bulletin.curr_number}", align: :center, :color => "0000FF"
    text "МЕТЕОРОЛОГИЧЕСКИЕ ДАННЫЕ И СВЕДЕНИЯ О СОСТОЯНИИ МОРЯ", align: :center, :color => "0000FF"
    move_down 10
    font "OpenSans"
    
    table meteo_data, width: bounds.width, cell_style: {padding: 3, border_width: 0.5, border_color: "000000", :inline_format => true, size: 9} do |t|
      t.cells.padding = [1, 1]
      t.cells.align = :center
      t.row(0).column(0).valign = :center
      t.row(0).columns(0).width = 90
      
      t.row(1).columns(1..13).rotate = 90
      if @bulletin.summer
        spec_cell = 7
        t.row(1).column(13).width = 40
        t.row(1).column(9).width = 60
      else
        spec_cell = 8
        t.row(1).column(10).width = 40
        t.row(1).column(13).width = 90
        t.row(1).column(13).rotate = -90
        t.row(1).column(13).valign = :center
      end
      t.row(1).columns(spec_cell).rotate = -90
      t.row(1).column(spec_cell).valign = :center
      # t.row(1).valign = :center
      t.row(1).column(spec_cell).width = 90
      
      t.row(1).columns(1..13).height = 100
      
      t.row(1).column(1).width = 40
      t.row(1).column(2).width = 40
      t.row(1).column(3).width = 40
      t.rows(2..5).size = 11
      t.row(5).align = :left
      t.row(5).leading = 4
    end
    move_down 10
    bounding_box([5, cursor], :width => bounds.width) do
      text "Время выпуска 13:00", size: 9
    end
    move_down 10
    table signatures, width: bounds.width, :column_widths => [270, 300], cell_style: {:overflow => :shrink_to_fit, size: 10, :inline_format => true } do |t|
      t.cells.border_width = 0
      t.row(2).size = 11
      t.column(1).position = :center
      # t.row(2).valign = :center
    end
	end
	
	def weather_forecast
		[ [{:content => "<b>По акватории Азовского моря (на участке с. Безыменное – пгт. Седово)</b>", :align => :center}, {:content => "<b>По г. Новоазовску, пгт. Седово</b>", :align => :center}],
      [@bulletin.forecast_day, @bulletin.forecast_day_city]]
	end
	def meteo_data
    m_d = []
    m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
	  if @bulletin.summer
	    colspan1 = 7
	    colspan2 = 6
	    head_row1 = [
	    "<color rgb='ff0000'>Максимальная 
	    температура воздуха
	    вчера днем</color>", 
	    "<color rgb='0000ff'>Минимальная 
	    температура воздуха
	    сегодня ночью</color>", 
	    "
	    Температура воздуха
	    в 9.00 часов сегодня", 
	    "
	    Количество осадков 
	    за сутки (мм)", "
	    Направление ветра", "
	    Максимальная скорость ветра (м/с)", "Явления погоды", 
	    "
	    Уровень моря
	    над '0' поста (см)", 
	    "Повышение (+) 
	    понижение (-) 
	    уровня моря 
	    за сутки (см)", "
	    Температура воды", "
	    Направление волн", "
	    Высота волн (дм)", 
	    "
	    Видимость"]
	    [0,1,2,9].each{|i| m_d[i] = m_d[i].to_f.round if m_d[i].present?}
	    data_row = ['Седово', m_d[0], m_d[1], m_d[2], m_d[3], m_d[4], m_d[5], m_d[6], m_d[7], m_d[8], m_d[9], m_d[10], m_d[11], m_d[12]]
    else
	    colspan1 = 8
	    colspan2 = 5
	    head_row1 = [
	    "<color rgb='ff0000'>Максимальная 
	    температура воздуха
	    вчера днем</color>", 
	    "<color rgb='0000ff'>Минимальная 
	    температура воздуха
	    сегодня ночью</color>", 
	    "Температура воздуха
	    в 9.00 часов сегодня", 
	    "Количество осадков 
	    за сутки (мм)",
	    "Высота снежного покрова (см)",
	    "Направление ветра", "Максимальная скорость ветра (м/с)", "Явления погоды", 
	    "Уровень моря
	    над '0' поста (см)", 
	    "Повышение (+) 
	    понижение (-) 
	    уровня моря 
	    за сутки (см)", "Температура воды", 
	    "Видимость", "Ледовое состояние"]
	    data_row = ['Седово', m_d[0], m_d[1], m_d[2], m_d[3], m_d[13], m_d[4], m_d[5], m_d[6], m_d[7], m_d[8], m_d[9], m_d[12], m_d[14]]
	  end
    report_date_prev = (@bulletin.report_date - 1.day).to_s(:custom_datetime)
    review_start_date = @bulletin.review_start_date.present? ? @bulletin.review_start_date.to_s(:custom_datetime) : (@bulletin.report_date-1.day).to_s(:custom_datetime)
	  [
	    [{:content => "Название
	    метеостанции", :rowspan => 2},{:content => "за период с 9.00 часов #{report_date_prev[8,2]} #{MONTH_NAME2[report_date_prev[5,2].to_i]} до 9.00 часов #{@bulletin.report_date_as_str}",
	    :colspan => colspan1},{:content => "в срок 9.00 часов #{@bulletin.report_date_as_str}", :colspan => colspan2}],
	    head_row1,
	    data_row,
	    [{:content => "<color rgb='0000ff'>ОБЗОР ПОГОДЫ</color>", :colspan => 8},{:content => "<color rgb='0000ff'>ОБЗОР СОСТОЯНИЯ АЗОВСКОГО МОРЯ</color>", :colspan => 6}],
	    [{:content => "за период с 9.00 часов #{review_start_date[8,2]} #{MONTH_NAME2[review_start_date[5,2].to_i]} до 9.00 часов #{@bulletin.report_date_as_str}", :colspan => 14}],
	    [{content: @bulletin.forecast_sea_day, colspan: 8},{content: @bulletin.forecast_sea_period, colspan: 6}]
    ]
	end
	def signatures
	  chief_descr = @bulletin.chief_2_pdf
    responsible_descr = @bulletin.responsible_2_pdf
    [ ["Ответственный за выпуск:","",""],
      [responsible_descr[:position], {:image => responsible_descr[:image_name], scale: 0.6, :vposition => :center}, {:padding => [16,5],:content => responsible_descr[:name]}],
      [{:padding => [10,5],:content => chief_descr[:position]}, {:image => chief_descr[:image_name], scale: 0.6}, {:padding => [10,5],:content => chief_descr[:name]}]]
	end
end