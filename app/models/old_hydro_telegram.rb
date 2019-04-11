# class OldHydroTelegram < Meteo
class OldHydroTelegram < Meteo2017
  self.table_name = 'gidro'
  TERMS = ['03', '09', '15', '21']
end