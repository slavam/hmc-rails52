class Precipitation < Prawn::Document
  def initialize(precipitation, year, month)
    super :page_size => "A4", :page_layout => :landscape
		@month = month
		@year = year
		@precipitation = precipitation
		@max_day = Time.days_in_month(@month.to_i, @year.to_i)
		font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    })
    move_down 20
    font "OpenSans", style: :bold
    text "Количество осадков (мм) за период с 01 по #{@max_day} #{Bulletin::MONTH_NAME2[@month.to_i]} #{@year} года", size: 12, align: :center
    move_down 20
    font "OpenSans", style: :normal
    table table_data, width: bounds.width, cell_style: { border_width: 0.3, :overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true, size: 9, align: :center } do |t|
      t.cells.padding = [2,2]
    end
  end
  def table_data
    h = [{content: "", colspan: 2}]
    (1..@max_day).map{|d| h << d.to_s}
    table = [h]
    names = ['','Донецк','Кировский','Авдотьино','Макеевка','Новоселовка','Дебальцево','Амвросиевка','Благодатное',
      'Стрюково','Дмитровка','Алексеево-Орловка','Старобешево','Раздольное','Тельманово','Седово']
    (1..15).each do |p|
      row_n = [{content: names[p], rowspan: 2},'Ночь']
      row_d = ['День']
      (1..@max_day).each do |d|
        row_n << ((@precipitation[p].present? and @precipitation[p][d].present? and @precipitation[p][d][0].present?) ? @precipitation[p][d][0] : '')
        row_d << ((@precipitation[p].present? and @precipitation[p][d].present? and @precipitation[p][d][1].present?) ? @precipitation[p][d][1] : '')
      end
      table << row_n
      table << row_d
    end
    table
  end
end