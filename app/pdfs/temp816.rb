class Temp816 < Prawn::Document
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
      text "Гидрометцентра МЧС ДНР"
      text "от _________________ № ____________"
    end
    move_down 20
    font "OpenSans", style: :bold
    text "Температура воздуха (°С) в 08.00 и 16.00 за период", size: 12, align: :center
    text "с 01 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года", size: 12, align: :center
    text "по данным репрезентативных метеорологических станций", size: 12, align: :center
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
      row = [d]
      # [1,1,5,6,7,10].each{|s| 
      [1,1,8,6,7,10,5].each{|s| 
        row << (@temperatures[d].present? && @temperatures[d][s].present? ? @temperatures[d][s][0] : '')
        row << (@temperatures[d].present? && @temperatures[d][s].present? ? @temperatures[d][s][1] : '')
      }
      table << row
    end
    [
      [
        {content: "<b>Число месяца</b>", rowspan: 2},
        {content: "<b>Донецк</b>", colspan: 2},
        {content: "<b>Макеевка</b>", colspan: 2}, 
        {content: "<b>Горловка</b>", colspan: 2}, 
        {content: "<b>Шахтерск</b>", colspan: 2},
        {content: "<b>Старобешево</b>", colspan: 2},
        {content: "<b>Новоазовск</b>", colspan: 2},
        {content: "<b>Мариуполь</b>", colspan: 2}
      ],
      ['08.00','16.00','08.00','16.00','08.00','16.00','08.00','16.00','08.00','16.00','08.00','16.00','08.00','16.00']
    ] + table
  end
end