export function checkSeaTelegram(tlg, stations, errors, observation, date_observation){
  if(tlg.substr(0,5) != "МОРЕ "){
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if (date_observation.substr(8,2) == tlg.substr(5,2)){
    observation.day_obs = tlg.substr(5,2);
  } else {
    errors.push("Число месяца не соответствует дню даты наблюдения"); // 20181126 K.O.A.
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
  errors.push("Отладка");
  return false;
}