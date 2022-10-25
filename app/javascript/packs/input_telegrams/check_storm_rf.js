import NewTelegramForm from "./new_telegram_form"

/*jshint esversion: 6 */
export function checkStormRf(code, tlg, error, isStart){
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
  const checkGroup3 = (tlg,start)=>{
    let group = tlg.substr(start,6)
    if(!/^3[0-9/]{2}[01]\d{2}$/.test(group)){
      error.push("Ошибка в формате группы 3")
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
  const checkGroup6=(tlg)=>{
    let group = tlg.substr(0,5)
    if(!/^6\d{3}\/$/.test(group)){
      error.push("Ошибка в формате группы 6")
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
  const checkGroup8=(tlg,start)=>{
    let group = tlg.substr(start,5)
    if(!/^8[0-9/]{4}$/.test(group)){
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
  const checkGroup932 = (tlg,start)=>{
    let group = tlg.substr(start,5)
    if(/^932\d\d$/.test(group)){}else{
      error.push("Ошибка в формате группы 932")
      return false
    }
    return true
  }  
  const checkSecondCode=(tlg,start)=>{
    let group = tlg.substr(start)
    // alert(group)
    if(/^ \d\d(=| .+=)$/.test(group))
      return true
    else{
      error.push("Ошибка в данных о втором коде явления")
      return false
    }
  }
  switch (code) {
    case 10:
    case 11:
    case 12:
      if(!checkGroup1(tlg))
        return false
      if(isStart){
        if(tlg[7]=='=')
          return true
        return checkSecondCode(tlg,7)
      }else
        if(tlg[7]==' '){
          if(tlg[8]=='7'){
            if(!checkGroup7(tlg,8))
              return false
            if(tlg[14]=='=')
              return true
            return checkSecondCode(tlg,14)
          }else
            return checkSecondCode(tlg,7)
        }else{
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
    case 16:
    case 17:
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup2(tlg,8))
        return false
      if(isStart){
        if(tlg[13]=='=')
          return true
        return checkSecondCode(tlg,13)
      }else
        if(tlg[13]==' '){
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
    case 26:
      if(!checkGroup45(tlg))
        return false
      if(tlg[5]==' '){
        if(!checkGroup7(tlg,6))
          return false
        if(tlg[12]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода 26")
          return false
        }
      }else{
        error.push("Нарушен формат сообщения для кода 26")
        return false
      }
    case 30:
      if(tlg[0]=='=')
        return true
      if(tlg[0]=='2'){
        let group = tlg.substr(0,5)
        if(!/^2\/\/[5-9/][0-9/]$/.test(group))
          return false
        if(tlg[5]==' '){
          if(tlg[6]=='8'){
            if(!checkGroup8(tlg,6))
              return false
            if(tlg[11]=='=')
              return true
            return checkSecondCode(tlg,11)
          }
          return checkSecondCode(tlg,6)
          // else{
          //   error.push("Нарушен формат сообщения для кода 30")
          //   return false
          // }
        }
        if(tlg[5]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода 30")
          return false
        }
      }
      if(tlg[0]=='8'){
        if(!checkGroup8(tlg,0))
          return false
        if(tlg[5]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода 30")
          return false
        }
      }else{
        error.push("Нарушен формат сообщения для кода 30")
        return false
      }
    case 31:
      if(tlg[0]=='=')
        return true
      if(tlg[0]=='2'){
        if(!checkGroup2(tlg,0))
          return false
        if(tlg[5]=='=')
          return true
        else{
          error.push("Нарушен формат сообщения для кода 31")
          return false
        }
      }
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup7(tlg,8))
        return false
      if(tlg[14]!='='){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }else
        return true
    case 40:
      let pos = 0
      if(tlg[0]=='2'){
        if(!checkGroup2(tlg,0))
          return false
        if(tlg[5]!=' '){
          error.push("Нарушен формат сообщения для кода 40")
          return false
        }
        pos = 6
      }
      if(!checkGroup7(tlg,pos))
        return false
      if(tlg[pos+6]!='='){
        error.push("Нарушен формат сообщения для кода 40")
        return false
      }else
        return true
    case 41:
    case 42:
    case 43:
    case 47:
      if(!checkGroup7(tlg,0))
        return false
      if(tlg[6]!='='){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }else
        return true
    case 44:
      if(!checkGroup7(tlg,0))
        return false
      if(tlg[6]==' '){
        if(!checkGroup8(tlg,7))
          return false
        if(tlg[12]!='='){
          error.push("Нарушен формат сообщения для кода 44")
          return false
        }else
          return true
      }
      if(tlg[6]!='='){
        error.push("Нарушен формат сообщения для кода 44")
        return false
      }else
        return true
    case 51:
      if(!checkGroup3(tlg,0))
        return false
      if(tlg[6]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода 51")
        return false
      }
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
    case 58:
    case 59:
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup3(tlg,8))
        return false
      if(tlg[14]=='=')
        return true
      if(tlg[14]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup7(tlg,15))
        return false
      if(tlg[21]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 62:
      if(!checkGroup6(tlg))
        return false
      if(tlg[5]!=' '){
        error.push("Нарушен формат сообщения для кода 62")
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
    case 63:
    case 64:
    case 65:
    case 66:
      if(!checkGroup6(tlg,0))
        return false
      if(tlg[5]!=' '){
          error.push("Нарушен формат сообщения для кода "+code)
          return false
        }
      if(!checkGroup906(tlg,6))
        return false
      if(tlg[11]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 68:
      if(!checkGroup3(tlg,0))
        return false
      if(tlg[6]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 81:
    case 82:
    case 83:
    case 86:
      if(!checkGroup6(tlg))
        return false
      if(tlg[5]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup906(tlg,6))
        return false
      if(tlg[11]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 89:
      if(tlg[0]=='=')
        return true
      if(tlg[1]=='0'){
        if(!checkGroup906(tlg,0))
          return false
        if(tlg[5]==' '){
          if(!checkGroup932(tlg,6))
            return false
          if(tlg[11]=='=')
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
      }
      if(tlg[1]!='3'){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup932(tlg,0))
        return false
      if(tlg[5]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
    case 90:
      if(!checkGroup906(tlg,0))
        return false
      if(tlg[5]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup932(tlg,6))
        return false
      if(tlg[11]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }  
    case 91:
    case 92:
      if(!checkGroup1(tlg))
        return false
      if(tlg[7]!=' '){
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }
      if(!checkGroup2(tlg,8))
        return false
      if(tlg[13]=='=')
        return true
      else{
        error.push("Нарушен формат сообщения для кода "+code)
        return false
      }  
    default:
      error = "Ошибка в коде WAREP"
      return false
  }
}