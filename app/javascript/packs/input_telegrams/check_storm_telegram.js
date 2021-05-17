/*jshint esversion: 6 */
export function checkStormTelegram(tlg, stations, errors, observation){
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
  // 20210517 mwm
  if(observation.telegram_date.substr(8,2) != tlg.substr(18,2)){
    errors.push("Номер дня не соответствует дате явления");
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
  if(tlg[24] != '1') {
    errors.push("Ошибка вида телеграммы (a=1)");
    return false;
  }
  if(observation.telegram_date){
    let nowLocal = new Date();
    let mlsNowUtc = new Date(nowLocal.getTime()+nowLocal.getTimezoneOffset()*1000*60).getTime();
    let mlsEventDateUtc = Date.parse(observation.telegram_date.substr(0,8)+tlg.substr(18,2)+' '+tlg.substr(20,2)+':'+tlg.substr(22,2)+':00');
    if(mlsEventDateUtc > mlsNowUtc){
      errors.push("Ошибка в дате/времени явления");
      return false;
    }
  }
  var windDirections = Array.from({ length: 37 }, (v, k) => k);
  windDirections.push(99);
  var codeWAREP = +tlg.substr(26,2);
  var currentPos = 29;

  while (currentPos <= tlg.length){
    if (isCodeWAREP()) {
      if (tlg[currentPos-1] == '=' && observation.telegram_type == 'ЩЭОЗМ') return true;
    } else {
      errors.push("Ошибочный код WAREP");
      return false;
    }
    if (checkByCode())
      if (tlg[currentPos-1] == '=')
        return true;
      else {
        codeWAREP = +tlg.substr(currentPos, 2);
        currentPos += 3;
      }
    else{
      return false;
    }
  }
  errors.push("Ошибка в окончании телеграммы");
  return false;

  function isCodeWAREP(){
    return [11, 12, 17, 18, 19, 30, 36, 40, 41, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 64, 65, 66, 68, 71, 75, 78, 90, 91, 92, 95].some(s => {
      return codeWAREP == s;
    });
  }
  function isGroup1(code, pos) {
    var value = +tlg.substr(pos+1,2);
    var avg_wind = ((code == 17) || (code == 18)) ? (tlg.substr(pos+3,2) == '//') : (0 < +tlg.substr(pos+3,2) <= 99);
    return (/^1[0-39]\d[0-9/]{4}$/.test(tlg.substr(pos, 7)) && windDirections.some(elem => elem == value) && avg_wind && (0 < +tlg.substr(pos+5,2) <= 99));
  }
  function isGroup2(pos){
    let correctDirection;
    let val = tlg.substr(pos+1,2);
    correctDirection = ((val == '//') || windDirections.some(elem => elem == +val));
    val = +tlg.substr(pos+3,2);
    let correctPrecipitation = (val == 17) || (val == 19) || (80 <= val <= 90);
    return (/^2[0-39/][0-9/][189]\d$/.test(tlg.substr(pos,5)) && correctDirection && correctPrecipitation);
  }
  function isGroup7(pos) {
    return (/^7\d{4}[0-9/]{2}$/.test(tlg.substr(pos,7)));
  }
  function isGroup8(pos){
    return /^8[0-9/]{4}$/.test(tlg.substr(pos,5));
  }
  function isGroup3(pos){
    return /^3\d{5}$/.test(tlg.substr(pos,6));
  }
  function isIce(pos){
    return /^[0-9/]{2}[01]\d{2}[12]$/.test(tlg.substr(pos,6));
  }
  function checkByCode(){
    switch (codeWAREP) {
      case 11:
      case 12:
      case 17:
      case 18:
      case 19:
      case 36:
      case 78:
        if (isGroup1(codeWAREP, currentPos)){
          currentPos = currentPos+8;
        } else {
          errors.push("Ошибка в группе 1");
          return false;
        }
        if(codeWAREP == 19)
          if (isGroup2(currentPos)){
            currentPos = currentPos+6;
            return true;
          } else {
            errors.push("Ошибка в группе 2");
            return false;
          }
        else if(codeWAREP == 36 || codeWAREP == 78)
          if (isGroup7(codeWAREP, currentPos)){
            currentPos = currentPos+8;
            return true;
          } else {
            errors.push("Ошибка в группе 7");
            return false;
          }
        else
          return true;
        break;
      case 30:
        if (isGroup8(currentPos)){
          currentPos = currentPos+6;
          return true;
        } else {
          errors.push("Ошибка в группе 8");
          return false;
        }
        break;
      case 40:
      case 41:
        if (isGroup7(currentPos)){
          currentPos += 8;
          if (tlg[currentPos] == '8')
            if (isGroup8(currentPos)){
              currentPos += 6;
              return true;
            } else {
              errors.push("Ошибка в группе 8");
              return false;
            }
          else if (tlg[currentPos] == '1')
            if (isGroup1(codeWAREP, currentPos)){
              currentPos += 8;
              return true;
            } else {
              errors.push("Ошибка в группе 1");
              return false;
            }
          return true;
        }else {
          errors.push("Ошибка в группе 7");
          return false;
        }
        break;
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        if (isIce(currentPos)){
          currentPos += 7;
          return true;
        } else {
          errors.push("Ошибка в группе 'Гололед'");
          return false;
        }
        break;
      case 61:
      case 62:
      case 64:
      case 65:
      case 66:
      case 71:
      case 75:
        if(isGroup3(currentPos)){
          currentPos += 7;
          return true;
        } else {
          errors.push("Ошибка в группе 3");
          return false;
        }
        break;
      case 68:
        if (/^[01]\d{2}$/.test(tlg.substr(currentPos,3))){
          currentPos += 4;
          return true;
        } else {
          errors.push("Ошибка в группе 'Ледяной дождь'");
          return false;
        }
        break;
      case 90:
      case 92:
        if(/^932\d{2}$/.test(tlg.substr(currentPos,5))){
          currentPos += 6;
          return true;
        } else {
          errors.push("Ошибка в группе 932");
          return false;
        }
        break;
      case 91:
        if(isGroup2(currentPos)){
          currentPos += 6;
          return true;
        } else {
          errors.push("Ошибка в группе 2");
          return false;
        }
        break;
      case 95:
        if(/^950\d{2}$/.test(tlg.substr(currentPos,5))){
          currentPos += 6;
          return true;
        } else {
          errors.push("Ошибка в группе 950");
          return false;
        }
    }
  }
}
