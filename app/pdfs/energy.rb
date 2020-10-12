class Energy < Prawn::Document
  def initialize(temperatures, year, month, chief, responsible)
		super(top_margin: 40, left_margin: 95, right_margin: 50, bottom_margin: 0)
		@temperatures = temperatures
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    image "./app/assets/images/eagle.png", :scale => 0.4, position: :center # at: [235, y_pos], 
    font "OpenSans", style: :bold
    move_down 20
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::HEAD, align: :center, size: 10
    end
    move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([0, cursor], width: bounds.width) do
      text "ул. Любавина, 2, г. Донецк, 83015 тел. (062) 311-40-10 тел./факс (062)340-99-25", align: :center, size: 10
      text "web: www.dnmchs.ru  Идентификационный код 51001468  E-mail: gidromet@mail.dnmchs.ru", align: :center, size: 10
    end
    
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      # text Time.now.strftime("%d.%m.%Y")+"#{Prawn::Text::NBSP * 30} № 03/#{Date.today.yday}"
      # text "К договору от 06.11.2019 № 2 05/19-20/03"
      text "_____________2020_______    № 06/________"
      text "К договору от 15.10.2020 № 05/20-21/06"
    end
    
    bounding_box([250, y_pos], width: bounds.width-250) do
      text "Директору
            ОП \"ЗУЕВСКАЯ ТЭС\"
            РП \"Энергия Донбасса\"
		
            Е.В. Железняку", leading: 3
    end
    # move_down 10
    text "О предоставлении информации"
    move_down 20
    @last_day = Time.days_in_month(month.to_i, year.to_i)
    text "Гидрометцентр МЧС ДНР предоставляет информацию о средней за сутки температуре воздуха в г. Зугрэсе за период 01-#{@last_day} #{Bulletin::MONTH_NAME2[month.to_i]} #{year} г. по дням (по данным репрезентативных метеорологических станций):", indent_paragraphs: 40, leading: 2
    case @last_day
      when 28
        @lines = 14
      when 31
        @lines = 16
      else
        @lines = 15
    end
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      t.cells.padding = [2,2,4,2]
    end
    if chief == 'Stec'
      position = "Врио начальника"
      name = "Н.В. Стец"
    else
      position = "Начальник"
      name = "М.Б. Лукьяненко"
    end
    move_down 10
    table [[{content: position, align: :left}, {content: name, align: :right}]], width: bounds.width, cell_style: { border_width: 0}
    move_cursor_to 20
    if responsible == 'Boyko'
      r = 'Бойко Любовь Николаевна'
    else
      r = 'Кияненко Маргарита Анатольевна'
    end
    text "#{r} (062) 303-10-45", size: 10
  end
  def table_data
    t = [["Число","Температура воздуха (°C)","Число","Температура воздуха (°C)"]]
    
    for i in (1..@lines)
      day2 = i+@lines <= @last_day ? i+@lines : nil
      val1 = @temperatures[i].present? ? @temperatures[i] : ''
      val2 = (day2.present? and @temperatures[day2].present?) ? @temperatures[@lines+i] : ''
      t << [i,val1,day2,val2]
    end
    t
  end
end