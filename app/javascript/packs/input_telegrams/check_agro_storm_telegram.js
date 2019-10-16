export function checkAgroStormTelegram(tlg, stations, errors, observation){
  if(~tlg.indexOf("ЩЭОЗМ ") || ~tlg.indexOf("ЩЭОЯЮ ") ){
    observation.telegram_type = tlg.substr(0, 5);
  } else {
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(~tlg.indexOf(" WAREP ")){} else {
    errors.push("Отсутствует идентификатор WAREP");
    return false;
  }
  var codeStation = tlg.substr(12,5);
  var isStation = false; 
  var idStation = -1;
  isStation = stations.some(function(s){
    idStation = s.id;
    return +codeStation == s.code;
  });
  if (isStation && (tlg[17] == ' ')) {
    observation.station_id = idStation;
  } else {
    errors.push("Ошибка в коде метеостанции");
    return false;
  }
  var value;
  value = +tlg.substr(18,2);
  if ((value > 0) && (value < 32)){
    observation.day_event = value;
  } else {
    errors.push("Ошибка в номере дня");
    return false;
  }
  value = +tlg.substr(20,2);
  if ((value >= 0) && (value < 24)){
    observation.hour_event = value;
  } else {
    errors.push("Ошибка в часе явления");
    return false;
  }
  value = +tlg.substr(22,2);
  if ((value >= 0) && (value < 60)){
    observation.minute_event = value;
  } else {
    errors.push("Ошибка в минутах явления");
    return false;
  }
  // var currentPos = 27;
  if(tlg[tlg.length-1] == '=')
    return true;
  else{
    errors.push("Ошибка в окончании телеграммы");
    return false;
  }
}