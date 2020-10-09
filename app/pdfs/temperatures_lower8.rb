class TemperaturesLower8 < Prawn::Document
  def initialize(temperatures, first_day_number, region, contract_date, contract_num)
    super :page_size => "A4", left_margin: 95
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    font "OpenSans"
    text "На Поручение Главы ДНР от 06.10.2020 № 01-33/815", align: :right
    # text "К договору от #{contract_date} № #{contract_num}", align: :right
    move_down 20
    text "Средняя за сутки (00:01-24:00) температура воздуха (°С), при ее значении +8°С и ниже, в #{region} c #{temperatures[0].strftime('%d.%m.%Y')}", align: :center, size: 14
    move_down 20
    k = temperatures[0].yday - first_day_number  #Date.new(year.to_i,10,1).yday
    my_table = [['Дата', 'Температура']]
    (0..4).each do |d|
      my_table << [temperatures[0]+d.days, temperatures[k+d]]
    end
    table my_table, width: 300
  end
end