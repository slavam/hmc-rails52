class AmvrosievkaTemp < Prawn::Document
  include HeadersDoc
  def initialize(temperatures, year, month, chief, responsible)
    super(left_margin: 80, right_margin: 50)
		@temperatures = temperatures
    
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    
    y_pos = cursor
    font "OpenSans"
    ugms_header
    move_down 10
    font "OpenSans", style: :normal
    y_pos = cursor
    bounding_box([0, y_pos], width: 300, leading: 3) do
      text "________________ № ________________"
      text "На № 76/24-25/02.01 от 18.10.2024"
    end
    
    bounding_box([250, y_pos], width: bounds.width-250) do
      text "Директору филиала
            АО \"ИНФРАСТРУКТУРНЫЕ ПРОЕКТЫ\"-
            \"Старобешевская ТЭС\"

            А.Е. Куцыну", leading: 3
    end
    text "О предоставлении информации"
    move_down 20
    @last_day = Time.days_in_month(month.to_i, year.to_i)
    text "ФГБУ \"УГМС по ДНР\" предоставляет информацию о средней за сутки температуре воздуха в пгт. Новый Свет за период 01-#{@last_day} #{Bulletin::MONTH_NAME2[month.to_i]} #{year} г. по данным репрезентативной метеорологической станции:", indent_paragraphs: 40, leading: 2
    case @last_day
      when 28
        @lines = 14
      when 31
        @lines = 16
      else
        @lines = 15
    end
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, align: :center } do |t|
      t.cells.padding = [2,2,4,2]
    end
    if chief == 'Stec'
      position = "Врио начальника"
      name = "Н.В. Стец"
    elsif chief == 'Arameleva'
      position = "Врио начальника"
      name = "М.А. Кияненко"
      # name = "О.В. Арамелева"
    elsif chief == 'Kijanenko'
      position = "Врио начальника"
      name = "М.А. Кияненко"
    else
      position = "Начальник"
      name = "М.Б. Лукьяненко"
    end
    move_down 30
    table [[{content: position, align: :left}, {content: name, align: :right}]], width: bounds.width, cell_style: { border_width: 0}
    move_cursor_to 20
    if responsible == 'Boyko'
      r = 'Бойко Любовь Николаевна'
    else
      r = 'Кияненко Маргарита Анатольевна'
    end
    text "#{r} +7(949) 331-34-85", size: 10
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