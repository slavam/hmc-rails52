import NewTelegramForm from "./new_telegram_form"

/*jshint esversion: 6 */
export function checkStormRf(code, tlg, error){
  const checkGroup1 = (tlg) =>{
    if(/^1[0-39]\d[0-9/]{2}\d\d/.test(tlg.substr(0, 7))){}else{
      error.push("Ошибка в формате группы 1")
      return false
    }
    let windDirection = +tlg.substr(1,2) 
    if((windDirection >= 0 && windDirection <= 36) || (windDirection == 99)){}else{
      error.push("Ошибка в направлении ветра группы 1")
      return false
    }
    if(+tlg.substr(3,2) > +tlg.substr(5,2)){
      error.push("Средняя скорость ветра больше максимальной")
      return false
    }
    return true
  }
  const checkGroup2 = (tlg,start)=>{
    let group = tlg.substr(start,5)
    if(!/^2[0-39/][0-9/][5-9/][0-9/]$/.test(group)){
      error.push("Ошибка в формате группы 2")
      return false
    }
    return true
  }
  const checkGroup45 = (tlg)=>{
    if(!/^[45][01]\d{3}/.test(tlg.substr(0,5))){
      error.push("Ошибка в формате группы "+tlg[0])
      return false
    }
    return true
  }
  const checkGroup7 = (tlg,start) =>{
    let group = tlg.substr(start,6)
    if(/^7[0-9/]{5}$/.test(group)){}else{
      error.push("Ошибка в формате группы 7")
      return false
    }
    let mdv = +group.substr(1,2)
    if(mdv>=50 && mdv<=55){
      error.push("Ошибка в группе 7, недопустимое значение VV")
      return false
    }
    return true
  }
  const checkGroup906 = (tlg,start)=>{
    let group = tlg.substr(start,5)
    if(/^906[0-6]\d$/.test(group)){}else{
      error.push("Ошибка в формате группы 906")
      return false
    }
    return true
  }
  
  switch (code) {
    case 10:
    case 11:
    case 12:
      if(checkGroup1(tlg)){}else
        return false
      if(tlg[7]=='='){
        error[0] = ''
        return true
      }else if(tlg[7]==' '){
        if(checkGroup7(tlg,8)){}else
          return false
        if(tlg[14]=='='){
          error[0] = ''
          return true
        }else{
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
      }else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 16:
    case 17:
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]==' '){
        if(!checkGroup2(tlg,8))
          return false
        if(tlg[13]=='=')
          return true
        if(tlg[13]==' '){
          error[0]=''
          if(!checkGroup906(tlg,14))
            return false
          if(tlg[19]=='=')
            return true
          else{
            error.push("Нарушен формат сообщения для кода "+code)
            return false
          }
        }else{
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
      }else{
        error.push("Должна присутствовать группа 2")
        return false
      }
    case 18:
    case 19:  
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]==' '){
        if(!checkGroup2(tlg,8))
          return false
        if(tlg[13]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
      }else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 21:
      if(!checkGroup45(tlg))
        return false
      if(tlg[5]==' '){
        if(!checkGroup7(tlg,6))
          return false
        if(tlg[12]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
      }
      if(tlg[5]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 22:
      if(!checkGroup45(tlg))
        return false
      if(tlg[5]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup7(tlg,6))
        return false
      if(tlg[12]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 24:
      if(tlg[0]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 25:
      if(!checkGroup45(tlg))
        return false
      if(tlg[5]=='=')
        return true
      if(tlg[5]==' '){
        if(!checkGroup7(tlg,6))
          return false
        if(tlg[12]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода "+code)
        return false
        }
      }else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    default:
      error = "Ошибка в коде WAREP"
      return false
  }
  // if(~tlg.indexOf("ЩЭОЗМ ") || ~tlg.indexOf("ЩЭОЯЮ ") ){
  //   observation.telegram_type = tlg.substr(0, 5);
  // } else {
  //   errors.push("Ошибка в различительной группе");
  //   return false;
  // }
}