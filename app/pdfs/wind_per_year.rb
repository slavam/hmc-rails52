class WindPerYear < Prawn::Document
  def initialize(wind, year, station)
    super :page_size => "A4", :page_layout => :landscape
		@wind = wind
		font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    move_down 20
    font "OpenSans", style: :bold
    text "Распределение ветра по направлениям на станции #{station} за #{year} год", size: 12, align: :center
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      t.cells.padding = [2,2]
    end
  end
  def table_data
    months = ['', '<b>Январь</b>', '<b>Февраль</b>', '<b>Март</b>', '<b>Апрель</b>', '<b>Май</b>', '<b>Июнь</b>', '<b>Июль</b>', '<b>Август</b>', '<b>Сентябрь</b>', '<b>Октябрь</b>', '<b>Ноябрь</b>', '<b>Декабрь</b>'];
    h = ['<b>Месяц</b>','<b>С</b>','<b>СВ</b>','<b>В</b>','<b>ЮВ</b>','<b>Ю</b>','<b>ЮЗ</b>','<b>З</b>','<b>СЗ</b>','<b>С ветром</b>','<b>Штиль</b>','<b>Всего</b>']
    table = [h]
    (1..12).each do |i|
      row_n = [{content: months[i], rowspan: 2}]
      row_p = []
      (1..11).each do |j|
        row_n << ((@wind[i].present? and @wind[i][j].present?) ? @wind[i][j] : '')
        row_p << (((j<9 or j==10) and @wind[i].present? and @wind[i][j].present? and @wind[i][j]>0 and @wind[i][9].present?) ? (@wind[i][j]*100.0/(j==10 ? @wind[i][11] : @wind[i][9])).round(1) : '')
      end
      table << row_n
      table << row_p
    end
    table
  end
end