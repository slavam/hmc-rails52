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
end