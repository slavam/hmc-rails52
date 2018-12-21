export function checkHydroTelegram(tlgText, hydroPosts, errors, observation, dateObservation){
  let tlg = tlgText;
  let type = tlg.substr(0,6);
  if((type == "ЩЭРЕХ ") || (type == 'ЩЭГОЛ ')){
    observation.hydro_type = type.trim();
  } else {
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(!hydroPosts.some(s => {observation.hydro_post_id = s.id; return s.code == +tlg.substr(6,5);})){
    errors.push("Ошибка в коде гидрологического поста");
    return false;
  }
  if (dateObservation.substr(8,2) == tlg.substr(12,2)){
    observation.day_obs = tlg.substr(12,2);
    observation.date_observation = dateObservation;
  } else {
    errors.push("Число месяца не соответствует дню даты наблюдения"); // 20181217 А.O.A.
    return false;
  }
  let hour = +tlg.substr(14,2);
  if((hour >= 0) && (hour < 24))
    observation.hour_obs = hour;
  else {
    errors.push("Ошибка в часе наблюдения");
    return false;
  }
  if(/[127]/.test(tlg[16])){
    observation.content_factor = tlg[16];
  } else {
    errors.push("Ошибка в признаке присутствия разделов");
    return false;
  }
  let currPos = 18;
  if(/^1\d{4}$/.test(tlg.substr(currPos,5))){
    currPos += 6;
  } else {
    errors.push("Ошибка в группе 1 раздела 1");
    return false;
  }
  if(/^2\d{3}[012]$/.test(tlg.substr(currPos,5))){
    currPos += 6;
  } else {
    errors.push("Ошибка в группе 2 раздела 1");
    return false;
  }
  if(tlg[currPos] == '3')
    if(/^3\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 3 раздела 1");
      return false;
    }
  if(tlg[currPos] == '4')
    if(/^4\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 4 раздела 1");
      return false;
    }
  if(tlg[currPos] == '5'){
    
  }
  if(tlg[currPos-1] == '=')
    return true;
  errors.push("Debugging");
  return false;
}