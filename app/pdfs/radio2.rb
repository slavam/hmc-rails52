class Radio2 < Prawn::Document
    def initialize(bulletin)
          super(top_margin: 40, left_margin: 80, right_margin: 50, bottom_margin: 0)
          @bulletin = bulletin
      font_families.update("OpenSans" => {
        :normal => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Regular.ttf"),
        :italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-Italic.ttf"),
        :bold => Rails.root.join("./app/assets/fonts/OpenSans/OpenSans-Bold.ttf"),
        :bold_italic => Rails.root.join("app/assets/fonts/OpenSans/OpenSans-BoldItalic.ttf")
      })
      y_pos = cursor
      # font "OpenSans"
      # bounding_box([300, y_pos], width: bounds.width-290) do
      #   text "Приложение
      #         к Плану передачи информации", leading: 3
      # end
      # move_down 10
      image "./app/assets/images/logo2015_2.png", :scale => 0.2, position: :center
      move_down 5
      font "OpenSans"
      bounding_box([0, cursor], width: bounds.width) do
        text Bulletin::HEAD1, align: :center, size: 10
        text Bulletin::HEAD2, align: :center, size: 10, style: :bold
        text Bulletin::HEAD3, align: :center, size: 10
        text Bulletin::HEAD4, align: :center, size: 11, style: :bold
      end
      # move_down 10
      font "OpenSans"
      bounding_box([0, cursor], width: bounds.width) do
        text Bulletin::ADDRESS, align: :center, size: 10
        # text 'ОГРН 1239300003909 ИНН 9303033080 КПП 930301001', align: :center, size: 10  
      end
      stroke do
        horizontal_line 0, bounds.width, :at => cursor
      end
      move_down 10
      text @bulletin.report_date.strftime("%d.%m.%Y")+'г.  № '+@bulletin.curr_number #+"-РС"
      move_down 20
      font "OpenSans", style: :bold
      text "ПРОГНОЗ ПОГОДЫ", align: :center
      # font "OpenSans"
      # text @bulletin.header_daily, align: :center
      report_date_next = @bulletin.report_date+1.day
      text "на #{'%02d' % report_date_next.day} #{Bulletin::MONTH_NAME2[report_date_next.month]} #{report_date_next.year} года", align: :center
      text "в Донецкой Народной Республике", align: :center
      font "OpenSans"
      move_down 10
      text @bulletin.forecast_day, leading: 3
      text @bulletin.forecast_period, leading: 3
      move_down 10
      # table temps, width: bounds.width,:cell_style => { :align => :center, :inline_format => true, :padding => [2, 2, 2, 2], :size => 11} do |t|
      #   t.column(0).align = :left
      #   t.row(0).column(0).align = :center
      # end
      if @bulletin.chief.present?
        chief_descr = @bulletin.chief_2_pdf
        move_down 10
        table_content =[[{:padding => [10,0],:content => chief_descr[:position]}, {padding: (chief_descr[:position] == "Начальник" ? [3,5]:[-5,5]),image: chief_descr[:image_name], scale: 0.6}, {:padding => [10,5], align: :right, :content => chief_descr[:name]}]]                    
        table table_content, width: bounds.width, :column_widths => [200, 150], cell_style: {:overflow => :shrink_to_fit, :font => 'OpenSans', :inline_format => true } do |t|
          t.cells.border_width = 0
        end
      end
      
      move_cursor_to 20
      synoptic_name = @bulletin.synoptic1.present? ? @bulletin.synoptic1 : 'Синоптик'
      text_box synoptic_name + " +7 856 303-10-34", :at => [0, 30], size: 9
    end
    def temps
      ret = [["<b>Город</b>",	"<b>Температура воздуха ночью (°C)</b>", "<b>Температура воздуха днем (°C)</b>"]]
      m_d = []
      m_d = @bulletin.meteo_data.split(";") if @bulletin.meteo_data.present?
      i = 0
      Bulletin::RADIO2_CITIES.each do |c|
        ret << [c, m_d[i*2], m_d[i*2+1]]
        i += 1
      end
      return ret
    end
  end