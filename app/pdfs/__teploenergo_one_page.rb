class TeploenergoOnePage < Prawn::Document
  def initialize(temperatures, year, month)
    super :page_size => "A4", :page_layout => :landscape
		# super(top_margin: 40)	
		signatory = 'chief'
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
    text "Средняя за сутки температура воздуха (°С) с 01 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года для населенных пунктов", size: 12, align: :center
    text "Донецкой Народной Республики", size: 12, align: :center
    move_down 20
    font "OpenSans"
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 8, align: :center } do |t|
      t.column(0).width = 90
      t.cells.padding = [1, 1]
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
    hdr = ['<b>Населенные пункты ДНР</b>']
    (1..@max_day).each {|d| hdr << d.to_s}
    table = []
    table[0] = hdr
    cities = ['',
      '<b>Донецк<br/>Пантелеймоновка<br/>Моспино<br/>Еленовка<br/>Макеевка<br/>Харцызск<br/>Ясиноватая</b>', 
      '<b>Амвросиевка<br/>Иловайск<br/>Старобешево<br/>Комсомольское</b>', 
      '<b>Дебальцево<br/>Углегорск</b>', 
      '<b>Докучаевск<br/>Тельманово</b>', 
      '','','','','',
      '<b>Новоазовск</b>',
      '<b>Горловка<br/>Енакиево</b>',
      '<b>Зугрэс<br/>Снежное<br/>Торез<br/>Шахтерск</b>',
      '<b>Ждановка<br/>Кировское</b>']
    # [1,3,2,4,10,11,12,13].each do |s|
    [1,3,2,4,10,11,12,13].each do |s|
      row = [cities[s]]
      (1..@max_day).each do |d|  
        day = d.to_s.rjust(2,'0')
        key = day+'-'+s.to_s.rjust(2,'0')
        if s == 11
          if @temperatures[day+'-01'] and @temperatures[day+'-03'] 
            v = ((@temperatures[day+'-01']+@temperatures[day+'-03'])/2).round(1);
            row << v
          else
            row << ''
          end
        elsif s > 11
          if @temperatures[day+'-02'] and @temperatures[day+'-03']
            db = @temperatures[day+'-03']
            a = @temperatures[day+'-02']
            if s == 12
              v = ((a+db)/2).round(1)
            else
              v = (db-(db-a)/3).round(1)
            end
            row << v
          else
            row << ''
          end
        else
          row << (@temperatures[key].present? ? @temperatures[key] : '')
        end
      end
      table << row
    end
      # if @temperatures[day+'-01'] and @temperatures[day+'-03'] 
      #   v = ((@temperatures[day+'-01']+@temperatures[day+'-03'])/2).round(1);
      #   row << v
      # else
      #   row << ''
      # end
      # if @temperatures[day+'-02'] and @temperatures[day+'-03']
      #   db = @temperatures[day+'-03']
      #   a = @temperatures[day+'-02']
      #   v = ((a+db)/2).round(1)
      #   row << v
      #   v = (db-(db-a)/3).round(1)
      #   row << v
      # else
      #   row << '' << ''
      # end
    # end
    # [
    #   [
    #     '<b>Населенные пункты ДНР</b>',
    #     '<b>Донецк<br/>Пантелеймоновка<br/>Моспино<br/>Еленовка<br/>Макеевка<br/>Харцызск<br/>Ясиноватая</b>', 
    #     '<b>Дебальцево<br/>Углегорск</b>', 
    #     '<b>Амвросиевка<br/>Иловайск<br/>Старобешево<br/>Комсомольское</b>', 
    #     '<b>Докучаевск<br/>Тельманово</b>', 
    #     '<b>Новоазовск</b>',
    #     '<b>Горловка<br/>Енакиево</b>',
    #     '<b>Зугрэс<br/>Снежное<br/>Торез<br/>Шахтерск</b>',
    #     '<b>Ждановка<br/>Кировское</b>'
    #   ]
    # ] + table
    table
  end
end    