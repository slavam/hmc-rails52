export function checkSynopticTelegram(term, tlg, errors, stations, observation){
  var sign = {'0': '', '1': '-'};
  var state = {
      group00: { errorMessage: 'Ошибка в группе 00 раздела 1', regex: /^[134/][12][0-9/]([0-4][0-9]|50|5[6-9]|[6-9][0-9]|\/\/)$/ },  // наблюдатели, Л.А. 20180405 iX = 1 or 2
      group0: { errorMessage: 'Ошибка в группе 0 раздела 1',   regex: /^[0-9/]([012][0-9]|3[0-6]|99|\/\/)([012][0-9]|30|\/\/)$/ },
      group1: { errorMessage: 'Ошибка в группе 1 раздела 1',  regex: /^1[01][0-5][0-9][0-9]$/ },
      group2: { errorMessage: 'Ошибка в группе 2 раздела 1',  regex: /^2[01][0-5][0-9][0-9]$/ },
      group3: { errorMessage: 'Ошибка в группе 3 раздела 1',  regex: /^3\d{4}$/ },
      group4: { errorMessage: 'Ошибка в группе 4 раздела 1',  regex: /^4\d{4}$/ },
      group5: { errorMessage: 'Ошибка в группе 5 раздела 1',  regex: /^5[0-8]\d{3}$/ },
      group6: { errorMessage: 'Ошибка в группе 6 раздела 1',  regex: /^6\d{3}[12]$/ }, // From Margo 20170315 
      group7: { errorMessage: 'Ошибка в группе 7 раздела 1',  regex: /^7\d{4}$/ },
      group8: { errorMessage: 'Ошибка в группе 8 раздела 1',  regex: /^8[0-9/]{4}$/ }, // From Margo 20170317 
      group31: { errorMessage: 'Ошибка в группе 1 раздела 3', regex: /^1[01][0-9]{3}$/ },
      group32: { errorMessage: 'Ошибка в группе 2 раздела 3', regex: /^2[01][0-9]{3}$/ },
      group34: { errorMessage: 'Ошибка в группе 4 раздела 3', regex: /^4[0-9/][0-9]{3}$/ },
      group35: { errorMessage: 'Ошибка в группе 5 раздела 3', regex: /^55[0-9]{3}$/ },
      group38: { errorMessage: 'Ошибка в группе 8 раздела 3', regex: /^8[0-9/]{2}([0-4][0-9]|50|5[6-9]|[6-9][0-9])$/ },
      group39: { errorMessage: 'Ошибка в группе 9 раздела 3', regex: /^9[0-9]{4}$/ },
      group51: { errorMessage: 'Ошибка в группе 1 раздела 5', regex: /^1[0-9/][01][0-9]{2}$/ },
      group53: { errorMessage: 'Ошибка в группе 3 раздела 5', regex: /^3[0-9/][01][0-9]{2}$/ },
      group55: { errorMessage: 'Ошибка в группе 5 раздела 5', regex: /^52[01][0-9]{2}$/ },
      group56: { errorMessage: 'Ошибка в группе 6 раздела 5', regex: /^6[0-9/]{4}$/ },
      group59: { errorMessage: 'Ошибка в группе 9 раздела 5', regex: /^9[0-9/]{4}$/ },
    
  };
  if((~tlg.indexOf("ЩЭСМЮ ") && (term % 2 == 0)) || (~tlg.indexOf("ЩЭСИД ") && (term % 2 == 1))){} else {
    errors.push("Ошибка в различительной группе =>"+tlg.substr(0, 6)+"; term="+term+';');
    return false;
  }
  var group = tlg.substr(6,5);
  var isStation = false; 
  var idStation = -1;
  isStation = stations.some(function(s){
    idStation = s.id;
    return +group == s.code;
  });
  if (isStation && (tlg[11] == ' ' || tlg[11] == '=')) {
    observation.station_id = idStation;
  } else {
    errors.push("Ошибка в коде метеостанции");
    return false;
  }
  
  group = tlg.substr(12,5);
  var regex = '';
  regex = state.group00.regex;
  if (regex.test(group) && ((tlg[17] == ' ') || (tlg[17] == '='))) {
    if((term==3) || (term==9) || (term==15) || (term==21))  // наблюдатели Донецк 20180405
      if (+tlg[12]!=4){
        errors.push("Для срока "+term+" в группа 00 должно быть iR=4");
        return false;
      }
    if(tlg[14] != '/')
      observation.cloud_base_height = tlg[14];
    if(tlg[15] != '/')
      observation.visibility_range = tlg.substr(15,2);
  } else {
    errors.push(state.group00.errorMessage);
    return false;
  }
  
  group = tlg.substr(18,5);
  regex = state.group0.regex;
  if (regex.test(group) && ((tlg[23] == ' ') || (tlg[23] == '='))) {      // ЩЭСИД 34524 41993 01102 10010 20010 40253 52004 74440 555 1/009=
// нужно доработать критерии
    // if ((+tlg[18]>=0) && (+tlg[18]<9))                                    // 20180405 по данным от Л.А.
    //   if ((+tlg.substr(15,2)>93) && (+tlg.substr(15,2)<=99)){             // 20180615 по данным от Л.А. 99 - теперь правильное значение
    //   }else 
    //     if((+tlg.substr(15,2)>89) && (+tlg.substr(15,2)<94) && (/ 74[2468]/.test(tlg) )) // 20181109 по данным от Л.А. нужно анализировать группу 7
    //     {
    //       errors.push("Дальность видимости не соответствует количеству облаков");
    //       return false;
    //     }
    // if ((tlg[18]=='/') || (+tlg[18]==9))                                    // 20180405 по данным от Л.А.
    //   if ((+tlg.substr(15,2)>89) && (+tlg.substr(15,2)<94)){ 
    //   }else{
    //     errors.push("Дальность видимости не соответствует количеству облаков");
    //     return false;
    //   }
    if (tlg[18] != '/') 
      observation.cloud_amount_1 = tlg[18];
    if (tlg[19] != '/')
      observation.wind_direction = tlg.substr(19,2);
    if (tlg[21] != '/')
      observation.wind_speed_avg = tlg.substr(21,2);
    
  } else {
    errors.push(state.group0.errorMessage);
    return false;
  }
  var section = '';
  var pos555 = -1;
  if(~tlg.indexOf(" 555 ")){
    pos555 = tlg.indexOf(" 555 ");
    section = tlg.substr(pos555+5, tlg.length-pos555-5-1).trim();
    if(section.length<5){
      errors.push("Ошибка в разделе 5");
      return false;
    }
    // console.log('section5-1:', section);
    while (section.length>=5) {
      if(~['1', '3', '5', '6', '9'].indexOf(section[0])){
        group = section.substr(0,5);
        var name = 'group5'+section[0];
        regex = state[name].regex;
        if (regex.test(group) && ((section[5] == ' ') || (section[5] == '=') || (section.length == 5))) {
          switch(section[0]) {
            case '1':
            case '3':
              if (section[1] != '/') {
                if (section[0] == '1') 
                  observation.soil_surface_condition_1 = section[1];
                else 
                  observation.soil_surface_condition_2 = section[1];
              }
              if (section[2] != '/') {
                // sign = section[2] == '0' ? '' : '-';
                if (section[0] == '1') 
                  observation.temperature_soil = sign[section[2]]+section.substr(3,2);
                else 
                  observation.temperature_soil_min = sign[section[2]]+section[3]+'.'+section[4];
              }
              break;
            case '5':
              // sign = section[2] == '0' ? '' : '-';
              observation.temperature_2cm_min = sign[section[2]]+section.substr(3,2);
              break;
            case '6':
              observation.precipitation_2 = section.substr(1,3);
              if ((term == 0) || (term == 12)){
                if (section[4] != '1'){
                  errors.push("Для срока "+term+" в разделе 5 группа 6 должно быть tR=1");
                  return false;
                }
                if (tlg[12] != '/'){
                  errors.push("Для срока "+term+" в разделе 1 группа 00 должно быть iR='/'");
                  return false;
                }
              }
              observation.precipitation_time_range_2 = section[4];
              break;
            // case '9':
          }
        } else {
          errors.push(state[name].errorMessage);
          return false;
        }
        section = section.substr(6).trim();
      } else {
        errors.push("Ошибка в разделе 5");
        return false;
      }
    }
  }

  section = '';
  var pos333 = -1;
  if(~tlg.indexOf(" 333 ")){
    pos333 = tlg.indexOf(" 333 ");
    section = tlg.substr(pos333+5, (pos555>0 ? pos555-pos333-5 : tlg.length-pos333-5-1)).trim();
    if(section.length<5){
      errors.push("Ошибка в разделе 3");
      return false;
    }
    // console.log('section3-1:', section);
    while (section.length>=5) {
      if(~['1', '2', '4', '5', '8', '9'].indexOf(section[0])){
        group = section.substr(0,5);
        name = 'group3'+section[0];
        regex = state[name].regex;
        if (regex.test(group) && ((section[5] == ' ') || (section[5] == '=') || (section.length == 5))) {
          switch(section[0]) {
            case '1': // KMA 20190715
              if(term != 18){
                errors.push("Ошибка в группе 1 раздела 3: только для срока 18");
                return false;
              }
            case '2':
              if((section[0] == '2') && (term != 6)){ // KMA 20190715
                errors.push("Ошибка в группе 2 раздела 3: только для срока 06");
                return false;
              }
              val = sign[section[1]]+section.substr(2,2)+'.'+section[4];
              if (section[0] == '1')
                observation.temperature_dey_max = val;
              else
                observation.temperature_night_min = val;
              break;
            case '4':
              if (section[1] != '/') {
                observation.underlying_surface_сondition = section[1];
                observation.snow_cover_height = section.substr(2,3);
              }
              break;
            case '5':
              observation.sunshine_duration = section.substr(2,2)+'.'+section[4];
              break;
            case '8':
              if (section[1] != '/') {
                observation.cloud_amount_3 = section[1];
                observation.cloud_form = section[2];
                observation.cloud_height = section.substr(3,2);
              }
              break;
            case '9':
              observation.weather_data_add = section.substr(1,4);
              break;
          }
        } else {
          errors.push(state[name].errorMessage);
          return false;
        }
        section = section.substr(6).trim();
      } else {
        errors.push("Ошибка в разделе 3");
        return false;
      }
    }
  }
  
  var lng = pos333>0 ? pos333-24 : (pos555>0 ? pos555-24 : tlg.length-24);
  section = tlg.substr(24, lng).trim();
  if(section.length<5){
    errors.push("Ошибка в разделе 1");
    return false;
  }
  var val = '';
  var first = '';
  if(tlg[24] != '1'){
    errors.push("Отсутствует обязательная группа 1 раздела 1");
    return false;
  }
  if(tlg[30] != '2'){
    errors.push("Отсутствует обязательная группа 2 раздела 1");
    return false;
  }
  while (section.length>=5) {
    if(~['1', '2', '3', '4', '5', '6', '7', '8'].indexOf(section[0])){
      group = section.substr(0,5);
      name = 'group'+section[0];
      regex = state[name].regex;
      if (regex.test(group) && ((section[5] == ' ') || (section[5] == '=') || (section.length == 5))) {
        switch(section[0]) {
          case '1':
          case '2':
            val = sign[section[1]]+section.substr(2,2)+'.'+section[4];
            if (section[0] == '1')
              observation.temperature = val;
            else
              observation.temperature_dew_point = val;
            break;
          case '3':
          case '4':
            first = section[1] == '0' ? '1' : '';
            val = first+section.substr(1,3)+'.'+section[4];
            if (section[0] == '3')
              observation.pressure_at_station_level = val;
            else
              observation.pressure_at_sea_level = val;
            break;
          case '5':
            observation.pressure_tendency_characteristic = section[1];
            observation.pressure_tendency = section.substr(2,2)+'.'+section[4];
            break;
          case '6':
            if ((term == 6) || (term == 18)){
              if (section[4] != '2'){
                errors.push("Для срока "+term+" в группе 6 раздела 1 должно быть tR=2");
                return false;
              }
              if (tlg[12] != '1'){
                errors.push("Для срока "+term+" в разделе 1 группа 00 должно быть iR=1");
                return false;
              }
            }
            observation.precipitation_1 = section.substr(1,3);
            observation.precipitation_time_range_1 = section[4];
            break;
          case '7':
            if (tlg[13] != '1'){ // 20180405 согласовано с наблюдателями и Л.А.
              errors.push("При наличии группы 7 раздела 1 долно быть iX=1");
              return false;
            }
            observation.weather_in_term = section.substr(1,2);
            observation.weather_past_1 = section[3];
            observation.weather_past_2 = section[4];
            break;
          case '8':
            if (section[1] != '/') {
              observation.cloud_amount_2 = section[1];
              observation.clouds_1 = section[2];
              observation.clouds_2 = section[3];
              observation.clouds_3 = section[4];
            }
        }
      } else {
        errors.push(state[name].errorMessage);
        return false;
      }
      if(section.length>6) // 20190408 
        if(section[0] < section[6]){
          section = section.substr(6).trim();
          if(section.length<5){ // 20210311
            errors.push("Нарушен размер группы в разделе 1 => "+section);
            return false;
          }
        }else{
          errors.push("Нарушена последовательность групп в разделе 1 => "+section);
          return false;  
        }
      else
        return true;
    } else {
      errors.push("Ошибка в разделе 1 => "+section);
      return false;
    }
  }
  return true;
}
