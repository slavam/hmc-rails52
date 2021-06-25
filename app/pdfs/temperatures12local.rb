class Temperatures12local < Prawn::Document
  def initialize(temperatures, year, month, signatory)
    super :page_size => "A4", left_margin: 95
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
    text "Температура воздуха (°С) в 12.00", size: 12, align: :center
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
      person = "Л.Н. Бойко"
    else
      position = "Врио начальника ОГМО"
      person = "М.А. Кияненко"
    end
    table [[position, person]], width: bounds.width, :column_widths => [330], cell_style: { border_width: 0, align: :left} do |t|
      t.cells.padding = [2,2]
    end
  end
  def table_data
    table = []
    (1..@max_day).each do |j|
      row = [j]
      (1..6).each do |i|  
        row << (@temperatures[i][j].present? ? @temperatures[i][j] : '')
      end
      table << row
    end
    [
      [
        '<b>Число месяца</b>',
        '<b>Донецк</b>', 
        '<b>Макеевка</b>', 
        '<b>Горловка</b>', 
        '<b>Шахтерск</b>', 
        '<b>Старобешево</b>', 
        '<b>Новоазовск</b>'
      ]
    ] + table
  end
end