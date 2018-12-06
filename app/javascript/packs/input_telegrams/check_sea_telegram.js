export function checkSeaTelegram(tlg, stations, errors, observation, date_observation){
  if(tlg.substr(0,5) != "МОРЕ "){
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if (date_observation.substr(8,2) == tlg.substr(5,2)){
    observation.day_obs = tlg.substr(5,2);
    observation.date_dev = date_observation;
  } else {
    errors.push("Число месяца не соответствует дню даты наблюдения"); // 20181126 А.O.A.
    return false;
  }
  if(([3,9,15,21].findIndex((e) => e == +tlg.substr(7,2))) != -1){
    observation.term = +tlg.substr(7,2);
  } else {
    errors.push("Ошибка в сроке");
    return false;
  }
  
  // if (/^[0123]\d{2}[012]\d$/.test(tlg.substr(12,5))){
  //   observation.hour_observation = tlg.substr(15,2);
  //   let d = new Date();
  //   observation.date_observation = d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+tlg.substr(12,2);
  // } else {
  //   errors.push("Ошибка в дате/времени наблюдения");
  //   return false;
  // }
  if(!stations.some(s => {observation.station_id = s.id; return s.code == +tlg.substr(10,5);})){
    errors.push("Ошибка в коде метеостанции");
    return false;
  }
  if(/[01239]\d{4}/.test(tlg.substr(16,5))){
  } else {
    errors.push("Ошибка в группе ветер-видимость");
    return false;
  }
  if(/\d{5}/.test(tlg.substr(22,5))){
  } else {
    errors.push("Ошибка в группе температуры");
    return false;
  }
  let currPos = 28;
  if(tlg.substr(currPos,2) == '90')
    if(/90\d{3}/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 90");
      return false;
    }
  if(tlg.substr(currPos,2) == '91')
    if(/91\d{3}/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 91");
      return false;
    }
  if(tlg[currPos] == '3')
    if(/^3[3489]\d{3}$/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 3");
      return false;
    }
  if(tlg[currPos] == '4')
    if(/^40[0-6][0-9/]\d$/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 4");
      return false;
    }
  if(/[125]/.test(tlg[currPos]))
    if(/^[125]\d{4}$/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 5");
      return false;
    }
  if(tlg[currPos] == '6')
    if(/^6\d[0-7]\d{2}$/.test(tlg.substr(currPos,5)))
      currPos += 6;
    else {
      errors.push("Ошибка в группе 6");
      return false;
    }
  if(tlg[currPos] == '7'){
    let i = 1;
    while (currPos < tlg.length) {
      if(/^7\d{2}[0-9/]{2}$/.test(tlg.substr(currPos,5)))
        currPos +=6;
      else{
        errors.push("Ошибка в группе 7["+i+"]");
        return false;
      }
      i += 1;
    }
  }
  if(tlg[currPos-1] == '=')
    return true;
  else {
    errors.push("Ошибка в окончании телеграммы");
    return false;
  }
}