require 'prawn'
class Teploenergo < Prawn::Document
  def initialize(temperatures, year, month)
		super(top_margin: 40)	
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
    font "OpenSans", style: :bold
    text "Средняя за сутки температура воздуха (°С) с 1 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года (по данным метеорологических станций)", size: 12
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      # t.cells.border_width = 0
    end
    # responsible_descr = @bulletin.responsible_2_pdf
    # move_cursor_to 20
    # text responsible_descr[:position]+" "+responsible_descr[:name]
  end
  def table_data
    table = []
    (1..@max_day).each do |d|
      row = [d]
      [1,3,2,4,5].each {|s|
        key = d.to_s.rjust(2,'0')+'-'+s.to_s
        row << (@temperatures[key].present? ? @temperatures[key] : '')
      }
      table << row
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{table.inspect}") 
    [
      ['<b>Число месяца</b>','<b>Донецк</b>', '<b>Дебальцево</b>', '<b>Амвросиевка</b>', '<b>Волноваха</b>', '<b>Мариуполь</b>']
    ] + table
  end
end