module HeadersDoc
  def bulletin_header(y_pos)
    image "./app/assets/images/logo2015_2.png", :scale => 0.4
    bounding_box([85, y_pos], width: bounds.width-85) do
      text Bulletin::HEAD1, align: :center, size: 10
      text Bulletin::HEAD2, align: :center, size: 10, style: :bold
      text Bulletin::HEAD3, align: :center, size: 10
      text Bulletin::HEAD4, align: :center, size: 11, style: :bold
      text Bulletin::ADDRESS, align: :center, size: 9
    end
  end

  def ugms_header
    image "./app/assets/images/logo2015_2.png", :scale => 0.2, position: :center
    move_down 5
    text Bulletin::HEAD1, align: :center, size: 10
    text Bulletin::HEAD2, align: :center, size: 10, style: :bold
    text Bulletin::HEAD3, align: :center, size: 10
    text Bulletin::ADDRESS, align: :center, size: 9
    text 'ОГРН 1239300003909 ИНН 9303033080 КПП 930301001', align: :center, size: 10
  end
end