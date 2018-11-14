module StormObservationHelper
  def cloud_amount(c_a)
    return 'Определить невозможно или наблюдения не производились' if c_a.nil?
    case c_a
      when 0
        "0 (облаков нет)"
      when 1
        '<=1 (но не 0)'
      when 2
        '2-3'
      when 3
        '4'
      when 4
        '5'
      when 5
        '6'
      when 6
        '7-8'
      when 7
        '>= 9 (но не 10, есть просветы)'
      when 8
        '10 (без просветов)'
      when 9
        'Определить невозможно (затруднена видимость)'
    end
  end
end
