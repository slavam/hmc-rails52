class Teploenergo5 < Prawn::Document
  def initialize(temperatures, year, month, signatory)
    super :page_size => "A4", left_margin: 95 #, :page_layout => :landscape
		# super(top_margin: 40)	
		@month = month
		@year = year
		@temperatures = temperatures
		@max_day = Time.days_in_month(@month.to_i, @year.to_i)
		font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    bounding_box([bounds.width-200, y_pos], width: 300, leading: 3) do
      text "Приложение к письму"
      text 'Донецкиого гидрометцентра'
      text 'ФГБУ "УГМС по ДНР"'
      text "от ___________ № 17/23/02.01"
    end
    move_down 20
    font "OpenSans", style: :bold
    text "Средняя за сутки (00:01-24:00) температура воздуха (°С)", size: 12, align: :center
    text "с 01 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года", size: 12, align: :center
    text "на метеостанциях Донецкой Народной Республики", size: 12, align: :center
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      t.cells.padding = [2,2]
    end
    move_down 40
    if signatory == 'chief'
      position = "Начальник ОГМО"
      # signature = "./app/assets/images/head_of_dep.png"
      person = "Л.Н. Бойко"
    else
      position = "Врио начальника ОГМО"
      # signature = "./app/assets/images/kian.png"
      person = "М.А. Кияненко"
    end
    # table [[position, {image: signature, scale: 0.6, padding: [-5,5], position: :center}, person]], width: bounds.width, cell_style: { border_width: 0, align: :center}
    table [[position, person]], width: bounds.width, :column_widths => [330], cell_style: { border_width: 0, align: :left} do |t|
      t.cells.padding = [2,2]
    end
  end
  def table_data
    table = []
    (1..@max_day).each do |d|
      day = d.to_s.rjust(2,'0')
      row = [d]
      [1,3,2,4,10].each do |s|
        key = day+'-'+s.to_s.rjust(2,'0')
        row << (@temperatures[key].present? ? @temperatures[key] : '')
      end
      
      table << row
    end
    [
      [
        '<b>Число месяца</b>',
        '<b>Донецк</b>', 
        '<b>Дебальцево</b>', 
        '<b>Амвросиевка</b>', 
        '<b>Волноваха</b>', 
        '<b>Седово</b>'
      ]
    ] + table
  end
end