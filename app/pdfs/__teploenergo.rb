class Teploenergo < Prawn::Document
  def initialize(temperatures, year, month, signatory)
    super :page_size => "A4", :page_layout => :landscape
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
    bounding_box([bounds.width-150, y_pos], width: 300, leading: 3) do
      text "Приложение к письму"
      text "Гидрометцентра МЧС ДНР"
      text "от _________ № _______"
    end
    move_down 20
    font "OpenSans", style: :bold
    text "Средняя за сутки температура воздуха (°С) с 01 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года (по данным метеорологических станций)", size: 12, align: :center
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, column_widths: [50,100,90,90,90,90,90,90], cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
    end
    move_down 20
    if signatory == 'chief'
      position = "Начальник ОГМО"
      signature = "./app/assets/images/head_of_dep.png"
      person = "Л.Н. Бойко"
    else
      position = "Врио начальника ОГМО"
      signature = "./app/assets/images/kian.png"
      person = "М.А. Кияненко"
    end
    table [[position, {image: signature, scale: 0.6, padding: [-5,5], position: :center}, person]], width: bounds.width, cell_style: { border_width: 0, align: :center}
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
      if @temperatures[day+'-01'] and @temperatures[day+'-03'] 
        v = ((@temperatures[day+'-01']+@temperatures[day+'-03'])/2).round(1);
        row << v
      else
        row << ''
      end
      if @temperatures[day+'-02'] and @temperatures[day+'-03']
        db = @temperatures[day+'-03']
        a = @temperatures[day+'-02']
        v = ((a+db)/2).round(1)
        row << v
        v = (db-(db-a)/3).round(1)
        row << v
      else
        row << '' << ''
      end
      table << row
    end
    [
      [
        '<b>Число месяца</b>',
        '<b>Донецк<br/>Пантелеймоновка<br/>Моспино<br/>Еленовка<br/>Макеевка<br/>Харцызск<br/>Ясиноватая</b>', 
        '<b>Дебальцево<br/>Углегорск</b>', 
        '<b>Амвросиевка<br/>Иловайск<br/>Старобешево<br/>Комсомольское</b>', 
        '<b>Докучаевск<br/>Тельманово</b>', 
        '<b>Новоазовск</b>',
        '<b>Горловка<br/>Енакиево</b>',
        '<b>Зугрэс<br/>Снежное<br/>Торез<br/>Шахтерск</b>',
        '<b>Ждановка<br/>Кировское</b>'
      ]
    ] + table
  end
end