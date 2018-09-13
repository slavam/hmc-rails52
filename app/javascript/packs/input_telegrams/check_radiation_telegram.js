export function checkRadiationTelegram(tlg, stations, errors, observation){
  if(tlg.substr(0,6) != "ЩЭРБХ "){
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(!stations.some(s => {observation.station_id = s.id; return s.code == +tlg.substr(6,5);})){
    errors.push("Ошибка в коде метеостанции");
    return false;
  }
  if (/^[0123]\d{2}[012]\d$/.test(tlg.substr(12,5))){
    observation.hour_observation = tlg.substr(15,2);
    let d = new Date();
    observation.date_observation = d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+tlg.substr(12,2);
  } else {
    errors.push("Ошибка в дате/времени наблюдения");
    return false;
  }
  if (/^8[012]\d{3}$/.test(tlg.substr(18,5))){
  } else {
    errors.push("Ошибка в данных о радиационной обстановке");
    return false;
  }
  if (tlg[23] == '=')
    return true;
  let pos_ov = 24;
  if(~tlg.indexOf(" 551")) {
    pos_ov = 30;
    if(/^5510[12345]$/.test(tlg.substr(24,5))){
    } else {
      errors.push("Ошибка в сведениях об ОВ/СДЯВ в воздухе");
      return false;
    }
  }
  if(~tlg.indexOf(" 552"))
    if(/^5520[12345]$/.test(tlg.substr(pos_ov,5))){
    } else {
      errors.push("Ошибка в сведениях об ОВ/СДЯВ в воде");
      return false;
    }
  if(tlg[pos_ov+5] == '=')
    return true;
  else {
    errors.push("Ошибка в окончании телеграммы");
    return false;
  }
}