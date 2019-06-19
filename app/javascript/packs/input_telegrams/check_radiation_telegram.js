export function checkRadiationTelegram(tlg, stations, errors, observation, currDate){
  if((tlg.substr(0,6) == "ЩЭРБХ ") || (tlg.substr(0,6) == "ЩЭРДЦ ")){
  }else{
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(!stations.some(s => {observation.station_id = s.id; return s.code == +tlg.substr(6,5);})){
    errors.push("Ошибка в коде метеостанции");
    return false;
  }
  if(tlg.substr(0,6) == "ЩЭРБХ "){
    if (/^[0123]\d{2}[012]\d$/.test(tlg.substr(12,5))){
      observation.hour_observation = tlg.substr(15,2) == '00' ? 1 : tlg.substr(15,2);
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
    if(~tlg.indexOf(" 552")){
      if(/^5520[12345]$/.test(tlg.substr(pos_ov,5))){
        pos_ov += 6;
      } else {
        errors.push("Ошибка в сведениях об ОВ/СДЯВ в воде");
        return false;
      }
    }
    if(tlg[pos_ov-1] == '=')
      return true;
    else {
      errors.push("Ошибка в окончании телеграммы");
      return false;
    }
  }else{
    // 20190614 Boyko
    // if (/^\d[012]\d[0123]\d$/.test(tlg.substr(12,5))){
      // if(tlg[12] != currDate[3]){
    if (/^\d\d[01]\d[0123]\d$/.test(tlg.substr(12,6))){
      // if(tlg.substr(12,2) != currDate.substr(2,2)){
      //   errors.push("Ошибка в годе");
      //   return false;
      // }
      // 20190619 year deleted Boyko
      // if(tlg.substr(13,2) != currDate.substr(5,2)){
      if(tlg.substr(14,2) != currDate.substr(5,2)){
        errors.push("Ошибка в номере месяца");
        return false;
      }
      // if(+tlg.substr(15,2) != currDate.substr(8,2)){
      // if(+tlg.substr(16,2) != currDate.substr(8,2)){
      if(+tlg.substr(12,2) != currDate.substr(8,2)){
        errors.push("Ошибка в номере дня");
        return false;
      }
      observation.date_observation = currDate;
      observation.hour_observation = 0;
    } else {
      errors.push("Ошибка в дате наблюдения");
      return false;
    }
    // if (/^8[012]\d{3}$/.test(tlg.substr(18,5))){
    //   if(+tlg.substr(20,3)<1){
    if (/^8[012]\d{3}$/.test(tlg.substr(19,5))){
      if(+tlg.substr(21,3)<1){
        errors.push("Отсутствуют данные о радиационной обстановке");
        return false;
      }
    } else {
      errors.push("Ошибка в данных о радиационной обстановке");
      return false;
    }
    // if (tlg[23] == '=')
    if (tlg[24] == '=')
      return true;
    else{
      errors.push("Ошибка в окончании телеграммы");
      return false;
    }
  }
}