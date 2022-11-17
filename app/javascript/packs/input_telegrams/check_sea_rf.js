/*jshint esversion: 6 */
export function checkSeaRf(s1, s2, s3, term, error){
  // const checkGroup=(regE,group)=>{
  //   return (regE.test(group))
  // }
  if(!/^01[1-9]0 $/.test(s1.slice(0,5))){
    error.push("Ошибка в формате отличительной группы раздела 1")
    return false
  }
  if(!/^1[0-39/][0-9/]{3} $/.test(s1.slice(5,11))){
    error.push("Ошибка в формате группы 1 раздела 1")
    return false
  }
  if(!/^2[0-9/]{3}[0-5/] $/.test(s1.slice(11,17))){
    error.push("Ошибка в формате группы 2 раздела 1")
    return false
  }
  if(!/^3[01/][0-9/]{3} $/.test(s1.slice(17,23))){
    error.push("Ошибка в формате группы 3 раздела 1")
    return false
  }
  if(!/^4[01/][0-9/]{3} $/.test(s1.slice(23,29))){
    error.push("Ошибка в формате группы 4 раздела 1")
    return false
  }
  let pos = 29
  let isGroup15 = false
  if(s1[29]=='5' && s1[30]!='9'){
    if(!/^5[0-3/][0-9/]{3} $/.test(s1.slice(29,35))){
      error.push("Ошибка в формате группы 5 раздела 1")
      return false
    }
    pos = 35
    isGroup15 = true
  }
  if(s1[pos]=='5' && s1[pos+1]=='9'){
    if(!/^59[0-9/]{3} $/.test(s1.slice(pos,pos+6))){
      error.push("Ошибка в формате группы 59 раздела 1")
      return false
    }
    pos += 6
  }
  if(s1[pos]=='6'){
    if(!isGroup15){
      error.push("Группа 6 раздела 1 не должна быть без группы 5")
      return false
    }
    if(!/^6[0-9/]{4} $/.test(s1.slice(pos,pos+6))){
      error.push("Ошибка в формате группы 6 раздела 1")
      return false
    }
    pos+=6
  }
  if(!/^8[1-5/][01/][0-9/]{3}$/.test(s1.slice(pos,pos+6))){
    error.push("Ошибка в формате группы 8 раздела 1")
    return false
  }
  pos+=7
  if(s1.length>pos){
    if(!/^88[01/][0-9/]{3} $/.test(s1.slice(pos,pos+7))){
      error.push("Ошибка в формате группы 88 раздела 1")
      return false
    }
    pos+=7
    if(!/^89[01/][0-9/]{3}$/.test(s1.slice(pos,pos+6))){
      error.push("Ошибка в формате группы 89 раздела 1")
      return false
    }
    if(term!=6){
      error.push("Группы 88 и 89 раздела 1 передаются только в срок=6")
      return false
    }
  }
  // ==============================================================
  if(s2.length >0){
    if(!/^02[1-9]0[0-3/] $/.test(s2.slice(0,6))){
      error.push("Ошибка в формате отличительной группы раздела 2")
      return false
    }
    pos=6
    if(s2[6]=='1'){
      if(!/^1[0-9/]{6} $/.test(s2.slice(pos,pos+8))){
        error.push("Ошибка в формате группы 1 раздела 2")
        return false
      }
      pos+=8
    }
    if(s2[pos]=='2'){
      if(!/^2[0-9/]{6} $/.test(s2.slice(pos,pos+8))){
        error.push("Ошибка в формате группы 2 раздела 2")
        return false
      }
      pos+=8
    }
    if(!/^3[0-9/]{6}$/.test(s2.slice(pos,pos+7))){
      error.push("Ошибка в формате группы 3 раздела 2")
      return false
    }
    pos+=8
    if(s2.length>pos){
      if(s2[pos]=='4'){
        if(!/^4[0-9/]{2}[012/][0-9/][1-9/]$/.test(s2.slice(pos,pos+6))){
          error.push("Ошибка в формате группы 4 раздела 2")
          return false
        }
        pos+=7
      }
      if(s2[pos]=='5'){
        if(!/^5[0-5/][0-3/][0-9/]{2}[0-8/]$/.test(s2.slice(pos,pos+6))){
          error.push("Ошибка в формате группы 5 раздела 2")
          return false
        }
        pos+=7
      }else{
        if(s2[4]=='0' || s2[4]=='/'){}else{
          error.push("При отсутствии группы 5 раздела 2 в отличительной группе Q=0 или Q=/")
          return false
        }
      }
      if(s2[pos]=='6'){
        if(!/^6[0-5/][0-3/][0-8/][0-3/][0-4/][0-9/]$/.test(s2.slice(pos,pos+7))){
          error.push("Ошибка в формате группы 6 раздела 2")
          return false
        }
        pos+=8
      }
      if(s2[pos]=='7'){
        if(!/^7[0-9/]{4}[0-6/]$/.test(s2.slice(pos,pos+6))){
          error.push("Ошибка в формате группы 7 раздела 2")
          return false
        }
      }
    }else
      if(s2[4]=='0' || s2[4]=='/'){}else{
        error.push("При отсутствии группы 5 раздела 2 в отличительной группе Q=0 или Q=/")
        return false
      }
  }
  // =========================================================
  if(s3.length>1){
    if(term!=6){
      error.push("Раздел 3 передается только в срок=6")
      return false
    }
    if(!/^03[1-9]0 $/.test(s3.slice(0,5))){
      error.push("Ошибка в формате отличительной группы раздела 3")
      return false
    }
    if(s3[5]=='1' || s3[5]=='2'){}else{
      error.push("Должны присутствовать группы 1 и/или 2 раздела 3")
      return false
    }
    pos=5
    if(s3[5]=='1'){
      if(!/^1[01]\d{3}$/.test(s3.slice(pos,pos+5))){
        error.push("Ошибка в формате группы 1 раздела 3")
        return false
      }
      if(s3[10]=='=')
        return true
      pos+=6
    }
    if(s3[pos]=='2'){
      if(!/^2[01]\d{3}$/.test(s3.slice(pos,pos+5))){
        error.push("Ошибка в формате группы 2 раздела 3")
        return false
      }
      if(s3[pos+5]=='=')
        return true
    }
  }else if(s3[0]!='='){
    error.push("Неверное окончание сообщения")
    return false
  }
  return true
}