# class OldSynopticTelegram < Meteo2017
class OldSynopticTelegram < Meteo
  self.table_name = 'sinop'
  TERMS = ['00', '03', '06', '09', '12', '15', '18', '21']
end
