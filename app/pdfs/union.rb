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
      text "Приложение
            к Плану передачи информации", leading: 3
    end
    move_down 20
    font "OpenSans", style: :bold
    text "ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ЦЕНТР МЧС ДНР", align: :center, size: 14
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
    text forecast.report_date.strftime("%d.%m.%Y")+'г.  № 06/'+forecast.curr_number
    move_down 20
    # font "OpenSans", style: :bold
    text "ПРОГНОЗ ПОГОДЫ", align: :center
    text "по городам Донецкой Народной Республики", align: :center
    text "на сутки "+(forecast.report_date+2.days).strftime("%d.%m.%Y")+" года", align: :center
    move_down 10
    table_content = [
      [{content: "#{forecast.synoptic_situation}", colspan: 3}],
      [{content: "Город", rowspan:2, align: :center},{content:'Температура воздуха, °С', colspan: 2, align: :center}],
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
      ["Мариуполь", {content: "#{forecast.east1_tn}", align: :center}, {content: "#{forecast.east1_td}", align: :center}],
      ["Волноваха", {content: "#{forecast.east2_tn}", align: :center}, {content: "#{forecast.east2_td}", align: :center}],
      ["Новоазовск", {content: "#{forecast.east3_tn}", align: :center}, {content: "#{forecast.east3_td}", align: :center}],
    ]
    table table_content, width: bounds.width, :column_widths => [130], cell_style: { inline_format: true, padding: [2, 2, 2, 2], size: 11} do |t|
      # t.column(0).align = :left
      # t.row(0).column(0).align = :center
    end
    donetsk_content = [
      [{content: "Прогноз погоды в столице Республики", rowspan: 2},{content: "#{forecast.forecast_capital}", colspan:5}],
      [ {content:'Температура воздуха, °С', colspan: 2, align: :center},
        {content:'Атмосферное давление, мм.рт.ст', colspan: 2, align: :center},
        {content:'Относительная влажность воздуха, %', align: :center}],
      [ {content: "Донецк", rowspan: 2},
        {content: "ночь", align: :center},
        {content: "день", align: :center},
        {content: "ночь", align: :center},
        {content: "день", align: :center},
        {content: "#{forecast.capital_humidity}", rowspan: 2, align: :center}
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
    table_content =[[{:padding => [10,0],:content => chief[:position]}, {position: :center, image: chief[:image_name], scale: 0.6}, {:padding => [10,5], align: :right, :content => chief[:name]}]]                    
    table table_content, width: bounds.width, :column_widths => [300, 100], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
      t.cells.border_width = 0
    end

    move_cursor_to 20
    synoptic_name = 'Синоптик'
    if forecast.synoptic.present?
      fullname = User.fullname_by_lastname(forecast.synoptic.split(' ')[0]) 
      synoptic_name = fullname if fullname>''
    end
    text_box synoptic_name + " (062) 303-10-34", :at => [0, 30], size: 9
  end
end