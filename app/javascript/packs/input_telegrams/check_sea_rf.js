/*jshint esversion: 6 */
export function checkSeaRf(s1, error){
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
  const pos = 29
  const isGroup15 = false
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
  if(s1.length>pos && s1[pos]=='8')
  return true
}