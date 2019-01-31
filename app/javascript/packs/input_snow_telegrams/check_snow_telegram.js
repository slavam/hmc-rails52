export function checkSnowTelegram(tlgText, snowPoints, errors, observation, dateObservation){
  let tlg = tlgText;
  let type = tlg.substr(0,6);
  if((type == "ЩЭСГХ ") || (type == "ЩЭСГА ") || (type == "ЩЭСГИ ")){
    observation.snow_type = type.trim();
  } else {
    errors.push("Ошибка в различительной группе");
    return false;
  }
  if(!snowPoints.some(s => {observation.snow_point_id = s.id; return s.code == +tlg.substr(6,5);})){
    errors.push("Ошибка в коде пункта снегосъемки");
    return false;
  }
  if (dateObservation.substr(8,2) == tlg.substr(12,2)){
    observation.day_obs = +tlg.substr(12,2);
  } else {
    errors.push("Ошибка в дне даты наблюдения"); // 20190129 А.O.A.
    return false;
  }
  if (dateObservation.substr(5,2) == tlg.substr(14,2)){
    observation.month_obs = +tlg.substr(14,2);
  } else {
    errors.push("Ошибка в месяце даты наблюдения"); // 20190129 А.O.A.
    return false;
  }
  if (dateObservation[3] == tlg[16]){
    observation.last_digit_year_obs = +tlg[16];
    observation.date_observation = dateObservation;
  } else {
    errors.push("Ошибка в последней цифре года наблюдения"); // 20190129 А.O.A.
    return false;
  }
  let currPos = 18;
  if(tlg[currPos] == '1')
    if(/^1[0-9/]{3}\d$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 1 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos] == '2')
    if(/^2[0-9/]{2}\d{2}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 2 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos] == '3')
    if(/^3[0-9/]{3}[0-4]$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 3 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos] == '4')
    if(/^4[0-9/]{3}[0-4]$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 4 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos] == '5')
    if(/^5[0-9/]{2}\d{2}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 5 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos] == '6')
    if(/^6[0-9/]{3}[0-4]$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else {
      errors.push("Ошибка в группе 6 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos-1]=='=')
    return true;
  let snowDateNum = 1;
  while(snowDateNum<=5){
    if(tlg[currPos]=='7')
      if(/^7[0123]\d[01]\d$/.test(tlg.substr(currPos,5)))
        currPos+=6;
      else{
        errors.push("Ошибка в группе 7["+snowDateNum+"] =>"+tlg.substr(currPos));
        return false;
      }
    if(tlg[currPos]=='8')
      if(/^8[0123]\d[01]\d$/.test(tlg.substr(currPos,5)))
        currPos+=6;
      else{
        errors.push("Ошибка в группе 8["+snowDateNum+"] =>"+tlg.substr(currPos));
        return false;
      }
    if((tlg[currPos]=='9') && (tlg[currPos+1]<'4'))
      if(/^9[0123]\d[01]\d$/.test(tlg.substr(currPos,5)))
        currPos+=6;
      else{
        errors.push("Ошибка в группе 9["+snowDateNum+"] =>"+tlg.substr(currPos));
        return false;
      }
    if(tlg[currPos]=='0')
      if(/^0[0123]\d[01]\d$/.test(tlg.substr(currPos,5)))
        currPos+=6;
      else{
        errors.push("Ошибка в группе 0["+snowDateNum+"] =>"+tlg.substr(currPos));
        return false;
      }
    if(tlg[currPos-1]=='=')
      return true;
    if((tlg[currPos]=='9') && (tlg[currPos+1]>'3'))
      break;
    else
      snowDateNum+=1;
  }
  if(tlg.substr(currPos,2)=='94')
    if(/^94\d{3}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 94 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg.substr(currPos,2)=='95')
    if(/^95\d{3}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 95 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg.substr(currPos,2)=='96')
    if(/^96[5-9]\d{2}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 96 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg.substr(currPos,2)=='97')
    if(/^97\d{3}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 97 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg.substr(currPos,2)=='98')
    if(/^98\d{3}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 98 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg.substr(currPos,2)=='99')
    if(/^99[5-9]\d{2}$/.test(tlg.substr(currPos,5)))
      currPos+=6;
    else{
      errors.push("Ошибка в группе 99 =>"+tlg.substr(currPos));
      return false;
    }
  if(tlg[currPos-1]=='=')
    return true;
  else{
    errors.push("Ошибка в окончании телеграммы =>"+tlg.substr(currPos-1));
    return false;
  }
}