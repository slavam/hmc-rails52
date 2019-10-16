export function checkSeaStormTelegram(tlg, stations, errors, observation){
  if(~tlg.indexOf("ЩЭОЯА ") || ~tlg.indexOf("ЩЭОЯУ ") ){
    observation.telegram_type = tlg.substr(0, 5);
  } else {
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(~tlg.indexOf(" WAREP ")){} else {
    errors.push("Отсутствует идентификатор WAREP");
    return false;
  }
  // var codeStation = tlg.substr(12,5);
  // var isStation = false; 
  // var idStation = -1;
  // isStation = stations.some(function(s){
  //   idStation = s.id;
  //   return +codeStation == s.code;
  // });
  // if (isStation && (tlg[17] == ' ')) {
  if (tlg.substr(12,6) == '99023 '){  
    observation.station_id = 10; // Sedovo idStation;
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
  var codeWAREP = +tlg.substr(25,2);
  var currentPos = 28;
  
  if (isCodeWAREP()) 
    return checkByCode();
  else {
    errors.push("Ошибочный код WAREP");
    return false;
  }
  
  function isCodeWAREP(){ 
    return [21, 22, 28, 29, 80, 81, 82].some(s => {
      return codeWAREP == s;
    });
  }
  function checkEnd(position){
    if(tlg[position]=='=')
      return true;
    else{
      errors.push("Ошибка в окончании телеграммы");
      return false;
    }
  }
  function checkByCode(){
    switch (codeWAREP) {
      case 21:
      case 22:
        if(/^4\d{4}$/.test(tlg.substr(currentPos,5))){
          if(tlg[currentPos+5]=='=')
            return true;
          else{
            currentPos += 6;
            if(tlg.substr(0, 5) == 'ЩЭОЯА')
              if(/^1[0-3]\d{3}$/.test(tlg.substr(currentPos,5)))
                return checkEnd(currentPos+5);
              else{
                errors.push("Ошибка в дополнительной группе 1");
                return false;
              }
            else // finish
              if(/^[0-3]\d[0-2]\d[0-5]\d$/.test(tlg.substr(currentPos,6)))
                return checkEnd(currentPos+6);
              else{
                errors.push("Ошибка в метке времени");
                return false;
              }
          }
        }else{
          errors.push("Ошибка в группе 4");
          return false;
        }
      // case 23:
      // case 24:
      // case 25:
      // case 26:
      // case 27:
      case 28:
      case 29:
        if(tlg.substr(0, 5) == 'ЩЭОЯУ' && codeWAREP == 28)
          if(/^3[12]\d{6}$/.test(tlg.substr(currentPos,8))){
            currentPos += 8;
            if(/^[0-3]\d[0-2]\d[0-5]\d$/.test(tlg.substr(currentPos,6)))
              return checkEnd(currentPos+6);
            else{
              errors.push("Ошибка в метке времени");
              return false;
            }
          }else{
            errors.push("Ошибка в группе 3");
            return false;
          }
        else
          if(/^3[12]\d{3}$/.test(tlg.substr(currentPos,5)))
            return checkEnd(currentPos+5);
          else{
            errors.push("Ошибка в группе 3");
            return false;
          }
      case 81:
        if(/^\d{7}$/.test(tlg.substr(currentPos,7)))
          return checkEnd(currentPos+7);
        else{
          errors.push("Ошибка в группе изменения температуры");
          return false;
        }          
      case 82:
        return checkEnd(tlg.length-1);
    }
  }
}