export function checkHydroTelegram(tlgText, hydroPosts, errors, observation, dateObservation){
  let tlg = tlgText;
  let type = tlg.substr(0,6);
  if((type == "ЩЭРЕХ ") || (type == "ЩЭРЕА ") || (type == "ЩЭРЕИ ") || (type == 'ЩЭГОЛ ')){
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
  if (tlg[currPos] != '9')
    if(checkSection1('1')){
      // console.log('>>>>>>>>>>> currPos=>'+currPos);
    } else {
      return false;
    }
  let groupNum = 0;
  if(tlg.substr(currPos-1,4) == ' 922'){
    if(tlg[16] != '2'){
      errors.push("Ошибка в признаке присутствия разделов =>"+tlg.substr(currPos));
      return false;
    }
    groupNum = 0;
    while (tlg.substr(currPos-1,4) == ' 922'){
      if(+tlg.substr(currPos+3,2)>0 && +tlg.substr(currPos+3,2)<32){
        currPos += 6;
        groupNum += 1;
      } else {
        errors.push("Ошибка в номере дня в разделе 922["+groupNum+"]");
        return false;
      }
      if(groupNum > 5){
        errors.push("Раздел 2 повторяется более 5 раз");
        return false;
      }
      if (checkSection1("922["+groupNum+"]")){
        // console.log('>>>>>>>>>>> currPos=>'+currPos+'; >'+tlg.substr(currPos));
      } else {
        errors.push(errors[0]+" =>"+tlg.substr(currPos));
        return false;
      }
    }
  }
  if(tlg.substr(currPos-1,4) == ' 966'){
    if(tlg[16] != '2'){
      errors.push("Ошибка в признаке присутствия разделов =>"+tlg.substr(currPos));
      return false;
    }
    if(+tlg.substr(currPos+3,2)>0 && +tlg.substr(currPos+3,2)<13){
      currPos+=6;
    } else {
      errors.push("Ошибка в номере месяца в разделе 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(/^1\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 1 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(/^2\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 2 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(/^3\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 3 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(/^4\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 4 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(/^5[0-3]\d[012]\d$/.test(tlg.substr(currPos,5))){
      currPos+=6;
    } else{
      errors.push("Ошибка в группе 5 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
    if(tlg[currPos] == '6')
      if(/^60\d{3}$/.test(tlg.substr(currPos,5))){
        currPos+=6;
      }else{
        errors.push("Ошибка в группе 6 раздела 966 =>"+tlg.substr(currPos));
        return false;
      }
    if(tlg[currPos] == '7')
      if(/^7\d{4}$/.test(tlg.substr(currPos,5))){
        currPos+=6;
      }else{
        errors.push("Ошибка в группе 7 раздела 966 =>"+tlg.substr(currPos));
        return false;
      }
    if(tlg[currPos] == '8')
      if(/^8[0-3]\d[012]\d$/.test(tlg.substr(currPos,5))){
        currPos+=6;
      } else{
        errors.push("Ошибка в группе 8 раздела 966 =>"+tlg.substr(currPos));
        return false;
      }
    if(/^9\d{4}$/.test(tlg.substr(currPos,5))){
      currPos+=6;
    }else{
      errors.push("Ошибка в группе 9 раздела 966 =>"+tlg.substr(currPos));
      return false;
    }
  }
  if(tlg.substr(currPos-1,5) == ' 9770'){
    if(tlg.substr(0,5) != 'ЩЭГОЛ'){
      errors.push("Ошибка в различительной группе =>"+tlg.substr(currPos));
      return false;
    }
    if(tlg[16] != '7'){
      errors.push("Ошибка в признаке присутствия разделов =>"+tlg.substr(currPos));
      return false;
    }
    if(tlg[currPos+4] == '1'){ // согласовано с АОА 20181225
      currPos+=6;
      if(/^1\d{4}$/.test(tlg.substr(currPos,5)))
        currPos+=6;
      else {
        errors.push("Ошибка в группе 1 раздела 97701 =>"+tlg.substr(currPos));
        return false;
      }
      if(/^2\d{3}[012]$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 2 раздела 97701 =>"+tlg.substr(currPos));
        return false;
      }  
      if(tlg[currPos] == '5')
        if(/^5\d{4}$/.test(tlg.substr(currPos,5))){
          currPos += 6;
        } else {
          errors.push("Ошибка в группе 5 раздела 97701");
          return false;
        }
      if(tlg[currPos] == '6')
        if(/^6\d{4}$/.test(tlg.substr(currPos,5))){
          currPos += 6;
        } else {
          errors.push("Ошибка в группе 6 раздела 97701");
          return false;
        }
    }
    if(tlg[currPos+4] == '5'){
      currPos+=6;
      if(/^0\d{3}[0-4]$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 0 раздела 97705");
        return false;
      }
    }
    currPos = tlg.length;
  }
  if(tlg[currPos-1] == '=')
    return true;
  else {
    errors.push("Ошибка в окончании телеграммы =>"+tlg.substr(currPos));
    return false;
  }
  // errors.push("Debugging =>"+tlg.substr(currPos));
  // return false;
  
  function checkSection1(sectionId){
    if(/^1\d{4}$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 1 раздела "+sectionId);
      return false;
    }
    if(/^2\d{3}[012]$/.test(tlg.substr(currPos,5))){
      currPos += 6;
    } else {
      errors.push("Ошибка в группе 2 раздела "+sectionId+" =>"+tlg.substr(currPos));
      return false;
    }
    if(tlg[currPos] == '3')
      if(/^3\d{4}$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 3 раздела "+sectionId);
        return false;
      }
    if(tlg[currPos] == '4')
      if(/^4\d{4}$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 4 раздела "+sectionId);
        return false;
      }
    if(tlg[currPos] == '5'){
      while (tlg[currPos] == '5'){
        groupNum += 1;
        if(groupNum > 5){
          errors.push("Группа 5 раздела "+sectionId+" повторяется более 5 раз");
          return false;
        }
        if(/^5\d{4}$/.test(tlg.substr(currPos,5))){
          currPos += 6;
        } else {
          errors.push("Ошибка в группе 5["+groupNum+"] раздела "+sectionId);
          return false;
        }
      }
    }
    if(tlg[currPos] == '6'){
      groupNum = 0;
      while (tlg[currPos] == '6'){
        groupNum += 1;
        if(groupNum > 5){
          errors.push("Группа 6 раздела "+sectionId+" повторяется более 5 раз");
          return false;
        }
        if(/^6\d{4}$/.test(tlg.substr(currPos,5))){
          currPos += 6;
        } else {
          errors.push("Ошибка в группе 6["+groupNum+"] раздела "+sectionId);
          return false;
        }
      }
    }
    if(tlg[currPos] == '7')
      if(/^7\d{4}$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 7 раздела "+sectionId);
        return false;
      }
    if(tlg[currPos] == '8')
      if(/^8\d{4}$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 8 раздела "+sectionId);
        return false;
      }
    if(tlg[currPos] == '0'){
      if(/^0\d{3}[0-4]$/.test(tlg.substr(currPos,5))){
        currPos += 6;
      } else {
        errors.push("Ошибка в группе 0 раздела "+sectionId);
        return false;
      }
      if(tlg.substr(currPos,3) == '988')
        if(/^988\d\d 0\d{3}[0-4]$/.test(tlg.substr(currPos,11))){
          currPos += 12;
        } else {
          errors.push("Ошибка в группе 988 раздела "+sectionId);
          return false;
        }
    }
    return true;
  }

}