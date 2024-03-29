class Union < Prawn::Document
  def initialize(forecast)
		super(top_margin: 40, left_margin: 80, right_margin: 50, bottom_margin: 0)
		# @forecast = forecast
    font_families.update("OpenSans" => {
      :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
      :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
      :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
      :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
    })
    y_pos = cursor
    font "OpenSans"
    bounding_box([300, y_pos], width: bounds.width-290) do
      text "Информация к Плану передачи
            от 03.02.2020 № 06/2020", leading: 3
    end
    # move_down 20
    font "OpenSans" #, style: :bold
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::HEAD1, align: :center, size: 10
      text Bulletin::HEAD2, align: :center, size: 10, style: :bold
      text Bulletin::HEAD3, align: :center, size: 10
    end
    # text 'ГБУ "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР МЧС ДНР"', align: :center, size: 14
    # move_down 10
    font "OpenSans" #, style: :italic
    bounding_box([0, cursor], width: bounds.width) do
      text Bulletin::ADDRESS, align: :center, size: 10
      text 'ОГРН 1239300003909 ИНН 9303033080 КПП 930301001', align: :center, size: 10
    end
    stroke do
      horizontal_line 0, bounds.width, :at => cursor
    end
    move_down 10
    text forecast.report_date.strftime("%d.%m.%Y")+'  № 06/'+forecast.curr_number
    # move_down 20
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    text "по городам Донецкой Народной Республики", align: :center
    text "на сутки "+(forecast.report_date+3.days).strftime("%d.%m.%Y")+" года", align: :center
    move_down 10
    table_content = [
      [{content: "#{forecast.synoptic_situation}", colspan: 3}],
      [{content: "Город", rowspan:2, align: :center, valign: :center},{content:'Температура воздуха, °С', colspan: 2, align: :center}],
      [{content: "ночь", align: :center},{content:"день", align: :center}],

      ["Прогноз погоды по северу Республики",{content: "#{forecast.forecast_north}", colspan:2}],
      ["Славянск", {content: "#{forecast.north1_tn}", align: :center}, {content: "#{forecast.north1_td}", align: :center}],
      ["Краматорск", {content: "#{forecast.north2_tn}", align: :center}, {content: "#{forecast.north2_td}", align: :center}],
      ["Горловка", {content: "#{forecast.north3_tn}", align: :center}, {content: "#{forecast.north3_td}", align: :center}],

      ["Прогноз погоды по западу Республики",{content: "#{forecast.forecast_west}", colspan:2}],
      ["Угледар", {content: "#{forecast.west1_tn}", align: :center}, {content: "#{forecast.west1_td}", align: :center}],
      ["Доброполье", {content: "#{forecast.west2_tn}", align: :center}, {content: "#{forecast.west2_td}", align: :center}],
      ["Красноармейск", {content: "#{forecast.west3_tn}", align: :center}, {content: "#{forecast.west3_td}", align: :center}],

      ["Прогноз погоды по югу Республики",{content: "#{forecast.forecast_south}", colspan:2}],
      ["Мариуполь", {content: "#{forecast.south1_tn}", align: :center}, {content: "#{forecast.south1_td}", align: :center}],
      ["Волноваха", {content: "#{forecast.south2_tn}", align: :center}, {content: "#{forecast.south2_td}", align: :center}],
      ["Новоазовск", {content: "#{forecast.south3_tn}", align: :center}, {content: "#{forecast.south3_td}", align: :center}],

      ["Прогноз погоды по востоку Республики",{content: "#{forecast.forecast_east}", colspan:2}],
      ["Ясиноватая", {content: "#{forecast.east1_tn}", align: :center}, {content: "#{forecast.east1_td}", align: :center}],
      ["Макеевка", {content: "#{forecast.east2_tn}", align: :center}, {content: "#{forecast.east2_td}", align: :center}],
      ["Шахтерск", {content: "#{forecast.east3_tn}", align: :center}, {content: "#{forecast.east3_td}", align: :center}],
    ]
    table table_content, width: bounds.width, :column_widths => [130,170], cell_style: { inline_format: true, padding: [2, 2, 2, 2], size: 11} do |t|
    end
    donetsk_content = [
      [{content: "Прогноз погоды в столице Республики", rowspan: 2},{content: "#{forecast.forecast_capital}", colspan:5}],
      [ {content:'Температура воздуха, °С', colspan: 2, align: :center},
        {content:'Атмосферное давление, мм.рт.ст', colspan: 2, align: :center},
        {content:'Относительная влажность воздуха, %', align: :center}],
      [ {content: "Донецк", rowspan: 2, valign: :center},
        {content: "ночь", align: :center},
        {content: "день", align: :center},
        {content: "ночь", align: :center},
        {content: "день", align: :center},
        {content: "#{forecast.capital_humidity}", rowspan: 2, align: :center, valign: :center}
      ],
      [ {content: "#{forecast.capital_tn}", align: :center},
        {content: "#{forecast.capital_td}", align: :center},
        {content: "#{forecast.capital_pn}", align: :center},
        {content: "#{forecast.capital_pd}", align: :center}
      ]
    ]
    table donetsk_content, width: bounds.width, :column_widths => [130], cell_style: { inline_format: true, padding: [2, 2, 2, 2], size: 11} do |t|
    end
    
    chief = UnionForecast.ogmo_chief(forecast.chief)

    move_down 10
    table_content =[[{:padding => [10,0],:content => chief[:position]}, {position: :center, image: chief[:image_name], scale: 0.5}, {:padding => [10,5], align: :right, :content => chief[:name]}]]
    table table_content, width: bounds.width, :column_widths => [210, 70], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end

    move_cursor_to 20
    synoptic_name = 'Синоптик'
    if forecast.synoptic.present?
      fullname = User.fullname_by_lastname(forecast.synoptic.split(' ')[0])
      synoptic_name = fullname if fullname>''
    end
    text_box synoptic_name + " +7 856 303-10-34", :at => [0, 30], size: 9
  end
end
