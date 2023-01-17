export function checkAgroDecRf(tlg, stations, errors, observation){
  // ЩЭАГЯ - ежедневная, ЩЭАГУ - декадная
  // if(~tlg.indexOf("ЩЭАГЯ ") || ~tlg.indexOf("ЩЭАГУ ") ){
  //   observation.telegram_type = tlg.substr(0, 5);
  // } else {
  //   errors.push("Ошибка в различительной группе");
  //   return false;
  // }
  // let codeStation = tlg.substr(0,5);
  let station;
  station = stations.find(s => +(tlg.substr(0,5))===s.value)
  if (station) {
    observation.station_id = station.id;
  } else {
    errors.push("Ошибка в коде станции");
    return false;
  }
  
  let obsDay = +tlg.substr(6, 2);
  if ([10, 20, 28, 29, 30, 31].indexOf(obsDay)>=0)
    observation.day_obs = obsDay;
  else {
    errors.push("Ошибка в дне наблюдения");
    return false;
  }
  
  let obsMonth = +tlg.substr(8, 2);
  if (1 <= obsMonth && obsMonth <= 12)
    observation.month_obs = obsMonth;
  else {
    errors.push("Ошибка в месяце наблюдения");
    return false;
  }
  
  // value = +tlg.substr(16, 1);
  // if (1 <= value && value <= 8)
    observation.telegram_num = +tlg[10]
  // else {
  //   errors.push("Ошибка в номере телеграммы");
  //   return false;
  // }
  
  var currentPos;
  // var sign = {'0': '', '1': '-'};
  let sign = ['','-']
  if (observation.telegram_type == 'ЩЭАГЯ'){ // ежедневные
    // if (tlg.substr(17,5) != ' 333 '){
    //   errors.push("Ошибка в признаке раздела 3");
    //   return false;
    // }
    // if (/^90[01]\d{2}$/.test(tlg.substr(22,5))){
    //   observation.temperature_max_12 = sign[tlg[24]]+tlg.substr(25,2);
    // } else {
    //   errors.push("Ошибка в разделе 3 зона 90");
    //   return false;
    // }
    // currentPos = 28;
    // if (tlg[currentPos] == '1') 
    //   if (/^1[01]\d{3}$/.test(tlg.substr(currentPos,5))){
    //     observation.temperature_avg_24 = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2)+'.'+tlg[currentPos+4];
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 1 зоны 90 раздела 3");
    //     return false;
    //   }
    // if (tlg[currentPos] == '3') 
    //   if (/^3[01]\d{2}\/$/.test(tlg.substr(currentPos,5))){
    //     observation.temperature_min_24 = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 3 зоны 90 раздела 3");
    //     return false;
    //   }
    // if (tlg[currentPos] == '4') 
    //   if (/^4[01]\d{2}\/$/.test(tlg.substr(currentPos,5))){
    //     observation.temperature_min_soil_24 = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 4 зоны 90 раздела 3");
    //     return false;
    //   }
    // if (tlg[currentPos] == '5') 
    //   if (/^5\d{3}[1-5/]$/.test(tlg.substr(currentPos,5))){
    //     observation.percipitation_24 = tlg.substr(currentPos+1,3);
    //     observation.percipitation_type = tlg[currentPos+4] == '/' ? null : tlg[currentPos+4];
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 5 зоны 90 раздела 3");
    //     return false;
    //   }
    // if (tlg[currentPos] == '6') 
    //   if (/^6\d{3}\/$/.test(tlg.substr(currentPos,5))){
    //     observation.percipitation_12 = tlg.substr(currentPos+1,3);
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 6 зоны 90 раздела 3");
    //     return false;
    //   }
    // // if (tlg[currentPos] == '7')  // 20181115
    //   if (/^7\d{4}$/.test(tlg.substr(currentPos,5))){
    //     observation.wind_speed_max_24 = tlg.substr(currentPos+1,2);
    //     observation.saturation_deficit_max_24 = tlg.substr(currentPos+3,2);
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в обязательной группе 7 зоны 90 раздела 3 =>"+tlg.substr(currentPos));
    //     return false;
    //   }
    // if (tlg[currentPos] == '8') 
    //   if (/^8\d{2}[012/]{2}$/.test(tlg.substr(currentPos,5))){ // 20180530 added '/' согласовал с Б.Л.Н.
    //     observation.duration_dew_24 = tlg.substr(currentPos+1,2);
    //     if (tlg[currentPos+3] != '/')
    //       observation.dew_intensity_max = tlg[currentPos+3];
    //     if (tlg[currentPos+4] != '/')
    //       observation.dew_intensity_8 = tlg[currentPos+4];
    //     currentPos += 6;
    //   }else{
    //     errors.push("Ошибка в группе 8 зоны 90 раздела 3");
    //     return false;
    //   }
    // if (tlg[currentPos] != '9'){ // 20181115 fixed
    //   errors.push("Ошибка в зоне 90 раздела 3 =>"+tlg.substr(currentPos));
    //   return false;
    // }
    // if (tlg.substr(currentPos, 2) == '91'){
    //   if (/^91[0-9/]{2}[0-6/]$/.test(tlg.substr(currentPos,5))){
    //     if (tlg.substr(currentPos+2,2) != '//')
    //       observation.sunshine_duration_24 = tlg.substr(currentPos+2,2);
    //     if (tlg[currentPos+4] != '/')
    //       observation.state_top_layer_soil = tlg[currentPos+4];
    //     currentPos += 6;
    //   } else {
    //     errors.push("Ошибка в разделе 3 зона 91");
    //     return false;
    //   }      
    //   if (tlg[currentPos] == '1') 
    //     if (/^1[0-9/]{4}$/.test(tlg.substr(currentPos,5))){ //20190419 возможны //// В.И.
    //       if (tlg[currentPos+1] != '/')
    //         observation.temperature_field_5_16 = tlg.substr(currentPos+1,2);
    //       if (tlg[currentPos+3] != '/')
    //         observation.temperature_field_10_16 = tlg.substr(currentPos+3,2);
    //       currentPos += 6;
    //     } else {
    //       errors.push("Ошибка в группе 1 зоны 91 раздела 3");
    //       return false;
    //     }
    //   if (tlg[currentPos] == '2') 
    //     if (/^2[0-9/]{4}$/.test(tlg.substr(currentPos,5))){ //20180412 возможны //// В.И.
    //       if (tlg[currentPos+1] != '/')  
    //         observation.temperature_avg_soil_5 = tlg.substr(currentPos+1,2);
    //       if (tlg[currentPos+3] != '/')
    //         observation.temperature_avg_soil_10 = tlg.substr(currentPos+3,2);
    //       currentPos += 6;
    //     } else {
    //       errors.push("Ошибка в группе 2 зоны 91 раздела 3");
    //       return false;
    //     }
    //   if ((tlg[currentPos] == '3') && (tlg.substr(currentPos,4) != '333 ' ))
    //     if (/^3\d{4}$/.test(tlg.substr(currentPos,5))){
    //       observation.saturation_deficit_avg_24 = tlg.substr(currentPos+1,2);
    //       observation.relative_humidity_min_24 = tlg.substr(currentPos+3,2);
    //       currentPos += 6;
    //     } else {
    //       errors.push("Ошибка в группе 3 зоны 91 раздела 3");
    //       return false;
    //     }
    //   if ((tlg.substr(currentPos,2) == '92') || (tlg.substr(currentPos,4) == '333 ') || (tlg[currentPos-1] == '=')){ // mwm 20180618
    //   } else { 
    //     errors.push("Ошибка в зоне 91 раздела 3 =>"+tlg.substr(currentPos));
    //     return false;
    //   }
    // }

    // let zone92pos = tlg.search(/92... [1678]/);
    // let zone92_95pos = tlg.search(/92... 95/);
    // let wrong333pos = tlg.indexOf('333', currentPos);
    // let end92pos;
    // if (zone92pos > 0){
    //   if (zone92_95pos > 0)
    //     end92pos = zone92_95pos;
    //   else if (wrong333pos > 0)
    //     end92pos = wrong333pos;
    //   else
    //     end92pos = tlg.length;
    //   currentPos = end92pos;
    //   let zone = tlg.substr(zone92pos-1,end92pos-zone92pos).split(' 92'); //20180710 mwm
    //   zone.splice(0,1);
    //   var state_crops;
    //   observation.state_crops = [];
    //   let code = true;
    //   zone.forEach((t, i) => {
    //     state_crops = {};
    //     state_crops.crop_code = t.substr(0, 3);
    //     let pos = 4;
    //     let j = 1;
    //     while (t.indexOf(' 1', pos-1)>0){
    //       if((j<6) && (/^1\d{2}[0-5/]\/$/.test(t.substr(pos,5)))){ // 20180405 В.И. на позиции 4 допустима /
    //         state_crops["development_phase_"+j] = t.substr(pos+1,2);
    //         if(t[pos+3] != '/')
    //           state_crops["assessment_condition_"+j] = t[pos+3];
    //         j += 1;
    //         pos += 6;
    //       }else {
    //         errors.push("Ошибка в группе 1["+j+"] зоны 92["+(i+1)+"] раздела 3");
    //         return code = false;
    //       }
    //     }
        
    //     j = 1;
    //     while (t.indexOf(' 6', pos-1)>0){
    //       if((j<6) && (/^6\d{3}[123]$/.test(t.substr(pos,5)))){
    //         state_crops["agricultural_work_"+j] = t.substr(pos+1,3);
    //         state_crops["index_weather_"+j] = t[pos+4];
    //         j += 1;
    //         pos += 6;
    //       }else {
    //         errors.push("Ошибка в группе 6["+j+"] зоны 92["+(i+1)+"] раздела 3 =>"+t.substr(pos,5));
    //         return code = false;
    //       }
    //     }
        
    //     j = 1;
    //     while (t.indexOf(' 7', pos-1)>0){
    //       if((j<6) && (/^7\d{3}[1-5]$/.test(t.substr(pos,5)))){
    //         state_crops["damage_plants_"+j] = t.substr(pos+1,3);
    //         state_crops["damage_volume_"+j] = t[pos+4];
    //         j += 1;
    //         pos += 6;
    //       }else {
    //         errors.push("Ошибка в группе 7["+j+"] зоны 92["+(i+1)+"] раздела 3");
    //         return code = false;
    //       }
    //     }
        
    //     if (pos < t.length){
    //       errors.push("Ошибка в зоне 92["+(i+1)+"] раздела 3 =>"+t.substr(pos));
    //       code = false;
    //     } else
    //       observation.state_crops.push(state_crops);
    //   });
    //   if (!code)
    //     return false;
    // }
    
    // if (zone92_95pos > 0){
    //   if (wrong333pos > 0)
    //     end92pos = wrong333pos;
    //   else
    //     end92pos = tlg.length;
    //   currentPos = end92pos;
    //   let zone = tlg.substr(zone92_95pos-1,end92pos-zone92_95pos).split(' 92'); // 20180710 mwm
    //   zone.splice(0,1);
    //   observation.damage_crops = [];
    //   let damage_crops;
    //   let code = true;
    //   zone.forEach((t, i) => {
    //     damage_crops = {};
    //     damage_crops.crop_code = t.substr(0, 3);
    //     let pos = 4;
    //     if( (/^95[0-9/]{3}$/.test(t.substr(pos,5)))){ // добавил /// по согласованию с В.И. 2018.02.28 (см. стр. 35)
    //       if (t[pos+2] != '/')
    //         damage_crops.height_snow_cover_rail = t.substr(pos+2,3);
    //       pos += 6;
    //     }else {
    //       errors.push("Ошибка в группе 95 зоны 92_95["+(i+1)+"] раздела 3");
    //       return code = false;
    //     }
        
    //     if (t[pos] == '4')
    //       if( (/^4\d{3}\/$/.test(t.substr(pos,5)))){
    //         damage_crops.depth_soil_freezing = t.substr(pos+1,3);
    //         pos += 6;
    //       }else {
    //         errors.push("Ошибка в группе 4 зоны 92_95["+(i+1)+"] раздела 3");
    //         return code = false;
    //       }
        
    //     if (t[pos] == '5')
    //       if( (/^5[1-7][01]\d{2}$/.test(t.substr(pos,5)))){
    //         damage_crops.thermometer_index = t[pos+1];
    //         damage_crops.temperature_dec_min_soil3 = sign[t[pos+2]]+t.substr(pos+3,2);
    //         pos += 6;
    //       }else {
    //         errors.push("Ошибка в группе 5 зоны 92_95["+(i+1)+"] раздела 3");
    //         return code = false;
    //       }
          
    //     if (pos < t.length){
    //       errors.push("Ошибка в зоне 92_95["+(i+1)+"] раздела 3 =>"+t.substr(pos));
    //       code = false;
    //     } else
    //       observation.damage_crops.push(damage_crops);
    //   });
    //   if (!code)
    //     return false;
    // }
    
    // if ((tlg[currentPos-1] == '=') || (tlg.substr(currentPos, 3) == '333'))
    //   return true;
    // else {
    //   errors.push("Ошибка в окончании телеграммы =>"+tlg.substr(currentPos));
    //   return false;
    // }
    
  } else {
    // ЩЭАГУ - декадная
    // currentPos = 18;
    if (tlg.substr(11,5) == ' 111 '){
      if (/^90[01]\d{2}$/.test(tlg.substr(16,5))){
        observation.temperature_dec_avg_delta = sign[tlg[18]]+tlg.substr(19,2);
      } else {
        errors.push("Ошибка в разделе 1 зона 90 =>"+tlg.substr(16,5)+"<=");
        return false;
      }
      currentPos = 22;
      if (tlg[currentPos] == '1') 
        if (/^1[01]\d{3}$/.test(tlg.substr(currentPos,5))){
          observation.temperature_dec_avg = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2)+'.'+tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 1 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '2') 
        if (/^2[01]\d{2}[0-9/]$/.test(tlg.substr(currentPos,5))){
          observation.temperature_dec_max = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
          if (tlg[currentPos+4] != '/')
            observation.hot_dec_day_num = tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 2 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '3') 
        if (/^3[01]\d{2}[0-9/]$/.test(tlg.substr(currentPos,5))){
          observation.temperature_dec_min = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
          if (tlg[currentPos+4] != '/')
            observation.dry_dec_day_num = tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 3 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '4')
        if (/^4[01]\d{2}[0-9/]$/.test(tlg.substr(currentPos,5))){
          observation.temperature_dec_min_soil = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
          if (tlg[currentPos+4] != '/')
            observation.cold_soil_dec_day_num = tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 4 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '5')
        if (/^5\d{3}[0-9/]$/.test(tlg.substr(currentPos,5))){
          observation.precipitation_dec = tlg.substr(currentPos+1,3);
          if (tlg[currentPos+4] != '/')
            observation.wet_dec_day_num = tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 5 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '6')
        if (/^6\d{4}$/.test(tlg.substr(currentPos,5))){
          observation.precipitation_dec_percent = tlg.substr(currentPos+1,4);
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 6 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '7')
        if (/^7\d{3}[0-9/]$/.test(tlg.substr(currentPos,5))){
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 7 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if (tlg[currentPos] == '8')
        if (/^8\d{2}[0-9/]{2}$/.test(tlg.substr(currentPos,5))){
          observation.wind_speed_dec_max = tlg.substr(currentPos+1,2);
          if (tlg[currentPos+3] != '/')
            observation.wind_speed_dec_max_day_num = tlg[currentPos+3];
          if (tlg[currentPos+4] != '/')
            observation.duster_dec_day_num = tlg[currentPos+4];
          currentPos += 6;
        }else{
          errors.push("Ошибка в группе 8 зоны 90 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
      if(tlg[currentPos-1]==='=')
        return true;
      if(tlg[currentPos]==='9'){
        if (/^91[01]\d{2}$/.test(tlg.substr(currentPos,5))){
          observation.temperature_dec_max_soil = sign[tlg[currentPos+2]]+tlg.substr(currentPos+3,2);
          currentPos += 6;
        } else {
          errors.push("Ошибка в разделе 1 зона 91 =>"+tlg.substr(currentPos,5)+"<=");
          return false;
        }
        if (tlg[currentPos] == '1')
          if (/^1\d{3}[0-9/]$/.test(tlg.substr(currentPos,5))){ // 20180411 время солнечного сияния м.б. /// А.И.
            if (tlg[currentPos+1] != '/')
              observation.sunshine_duration_dec = tlg.substr(currentPos+1,3);
            if (tlg[currentPos+4] != '/')
              observation.freezing_dec_day_num = tlg[currentPos+4];
            currentPos += 6;
          }else{
            errors.push("Ошибка в группе 1 зоны 91 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
            return false;
          }
        if (tlg[currentPos] == '2')
          if (/^2\d\d[0-9/]{2}$/.test(tlg.substr(currentPos,5))){ // 20180711 mwm
            // if (tlg[currentPos+1] != '/')
              observation.temperature_dec_avg_soil10 = tlg.substr(currentPos+1,2);
            if (tlg[currentPos+3] != '/')
              observation.temperature25_soil10_dec_day_num = tlg[currentPos+3];
            if (tlg[currentPos+4] != '/')
              observation.dew_dec_day_num = tlg[currentPos+4];
            currentPos += 6;
          }else{
            errors.push("Ошибка в группе 2 зоны 91 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
            return false;
          }
        if (tlg[currentPos] == '3')
          if (/^3\d{4}$/.test(tlg.substr(currentPos,5))){
            observation.saturation_deficit_dec_avg = tlg.substr(currentPos+1,2);
            observation.relative_humidity_dec_avg = tlg.substr(currentPos+3,2);
            currentPos += 6;
          }else{
            errors.push("Ошибка в группе 3 зоны 91 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
            return false;
          }
        if (tlg[currentPos] == '4')
          if (/^4[01]\d{2}[0-9/]$/.test(tlg.substr(currentPos,5))){
            // observation.saturation_deficit_dec_avg = tlg.substr(currentPos+1,2);
            // observation.relative_humidity_dec_avg = tlg.substr(currentPos+3,2);
            currentPos += 6;
          }else{
            errors.push("Ошибка в группе 4 зоны 91 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
            return false;
          }
        if (tlg[currentPos] == '5')
          if (/^5[0-9/]{3}\/$/.test(tlg.substr(currentPos,5))){
            // observation.saturation_deficit_dec_avg = tlg.substr(currentPos+1,2);
            // observation.relative_humidity_dec_avg = tlg.substr(currentPos+3,2);
            currentPos += 6;
          }else{
            errors.push("Ошибка в группе 5 зоны 91 раздела 1 =>"+tlg.substr(currentPos,5)+"<=");
            return false;
          }
      }
      // if (tlg[currentPos] == '4')
      //   if (/^4\d{3}[0-9/]$/.test(tlg.substr(currentPos,5))){
      //     observation.percipitation_dec_max = tlg.substr(currentPos+1,3);
      //     if (tlg[currentPos+4] != '/')
      //       observation.percipitation5_dec_day_num = tlg[currentPos+4];
      //     currentPos += 6;
      //   }else{
      //     errors.push("Ошибка в группе 4 зоны 91 раздела 1");
      //     return false;
      //   }
    } // контроль раздела 1 закончен
    
    if ((tlg[currentPos-1]==='='))
      return true;
    else 
      if (tlg.substr(currentPos-1,5) != ' 222 '){
        errors.push("Ошибка в признаке раздела 2");
        return false;
      } else
        currentPos += 4;
      
    if (/^92\d{3}$/.test(tlg.substr(currentPos,5))){
      let zone = tlg.substr(currentPos-1).split(' 92');
      zone.splice(0,1);
      let state_crops;
      observation.state_crops = [];
      let code = true;
      zone.forEach((t, i) => {
        state_crops = {};
        state_crops.crop_code = t.substr(0, 3);
        let pos = 4;
        if (t[4] == '1')
          if (/^1\d{4}$/.test(t.substr(pos,5))){
            state_crops.plot_code = t.substr(pos+1,3);
            state_crops.agrotechnology = t[pos+4];
            pos += 6;
          }else{
            errors.push("Ошибка в группе 1 зоны 92["+(i+1)+"] раздела 2");
            return code = false;
          }
        let zonePos = t.search(/ 9/);
        zonePos = zonePos > 0 ? zonePos : t.length-1;
        if(pos < zonePos){ // zone92
          // let zone92 = t.substr(pos, zonePos-pos);
          let j = 1;
          while ((0<t.indexOf(' 2', pos-1)) &&(t.indexOf(' 2', pos-1)<zonePos)){
            if((j<6) && (/^2\d{2}[0-9/][1-5]$/.test(t.substr(pos,5)))){ // 2018.03.01 mwm assessment_condition => /
              state_crops["development_phase_"+j] = t.substr(pos+1,2);
              if(t[pos+3] != '/')
                state_crops["day_phase_"+j] = t[pos+3];
              if(t[pos+4] != '/')
                state_crops["assessment_condition_"+j] = t[pos+4];
              j += 1;
              pos += 6;
            }else {
              errors.push("Ошибка в группе 2["+j+"] зоны 92["+(i+1)+"] раздела 2");
              return code = false;
            }
          }
          if (t[pos] == '3')
            if (/^3[0-4/][0-9/]{3}$/.test(t.substr(pos,5))){ // 20180503 mwm add ////
              if (t[pos+1] != '/')
                state_crops.clogging_weeds = t[pos+1];
              if (t[pos+2] != '/')
                state_crops.height_plants = t.substr(pos+2,3);
              pos += 6;
            }else{
              errors.push("Ошибка в группе 3 зоны 92["+(i+1)+"] раздела 2");
              return code = false;
            }
          if (t[pos] == '4')
            if (/^4\d{4}$/.test(t.substr(pos,5))){
              state_crops.number_plants = t.substr(pos+2,3);
              pos += 6;
            }else{
              errors.push("Ошибка в группе 4 зоны 92["+(i+1)+"] раздела 2");
              return code = false;
            }
          if (t[pos] == '5')
            if (/^5\d{4}$/.test(t.substr(pos,5))){
              state_crops.average_mass = t.substr(pos+2,3);
              pos += 6;
            }else{
              errors.push("Ошибка в группе 5 зоны 92["+(i+1)+"] раздела 2");
              return code = false;
            }
          j = 1;
          while ((t.indexOf(' 6', pos-1)>0) && (t.indexOf(' 6', pos-1)<zonePos)){
            if((j<6) && (/^6\d{4}$/.test(t.substr(pos,5)))){
              state_crops["agricultural_work_"+j] = t.substr(pos+1,3);
              state_crops["day_work_"+j] = t[pos+4];
              j += 1;
              pos += 6;
            }else {
              errors.push("Ошибка в группе 6["+j+"] зоны 92["+(i+1)+"] раздела 2 g=>"+t.substr(pos,5)+" t=>"+t+" pos=>"+pos);
              return code = false;
            }
          }
          j = 1;
          while ((t.indexOf(' 7', pos-1)>0) && (t.indexOf(' 7', pos-1)<zonePos)){
            if((j<6) && (/^7\d{3}[0-9/]$/.test(t.substr(pos,5)))){  // 20180303 mwm add /
              state_crops["damage_plants_"+j] = t.substr(pos+1,3);
              state_crops["day_damage_"+j] = t[pos+4];
              pos += 6;
            }else {
              errors.push("Ошибка в группе 7["+j+"] зоны 92["+(i+1)+"] раздела 2");
              return code = false;
            }
            if (t[pos] == '0')
              if(/^0[0-9/]{4}$/.test(t.substr(pos,5))){ // mwm 20180521
                if (t[pos+1] != '/')
                  state_crops["damage_level_"+j] = t[pos+1];
                if (t[pos+2] != '/')
                  state_crops["damage_volume_"+j] = t[pos+2];
                if (t[pos+3] != '/')
                  state_crops["damage_space_"+j] = t.substr(pos+3,2);
                pos += 6;
              }else {
                errors.push("Ошибка в группе 0["+j+"] зоны 92["+(i+1)+"] раздела 2");
                return code = false;
              }
            j += 1;
          }
        }
        if (/ 93/.test(t.substr(pos-1,3))){ // zone 93
          if (/^93[0-9/]{3}$/.test(t.substr(pos,5))){
            if (t[pos+2] != '/')
              state_crops.number_spicas = t.substr(pos+2,2);
            if (t[pos+4] != '/')
              state_crops.num_bad_spicas = t[pos+4];
            pos += 6;
          }else {
            errors.push("Ошибка в группе 93 зоны 92["+(i+1)+"] раздела 2");
            return code = false;
          }
          if (t[pos] == '1')
            if (/^1\d{4}$/.test(t.substr(pos,5))){
              state_crops.number_stalks = t.substr(pos+1,4);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 1 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
          if (t[pos] == '2')
            if (/^2\d{4}$/.test(t.substr(pos,5))){
              state_crops.stalk_with_spike_num = t.substr(pos+1,4);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 2 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
          if (t[pos] == '3')
            if (/^3[0-9/]{4}$/.test(t.substr(pos,5))){ // 20180621 mwm add /
              if(t[pos+1] != '/')
                state_crops.normal_size_potato = t.substr(pos+1,2);
              if(t[pos+3] != '/')
                state_crops.losses = t.substr(pos+3,2);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 3 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
          if (t[pos] == '4')
            if (/^4[0-9/]{4}$/.test(t.substr(pos,5))){  // 20180621 mwm add /
              if(t[pos+1] != '/')
                state_crops.grain_num = t.substr(pos+1,3);
              if(t[pos+4] != '/')
                state_crops.bad_grain_percent = t[pos+4];
              pos += 6;
            }else {
              errors.push("Ошибка в группе 4 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
          if (t[pos] == '5')
            if (/^5[0-9/]{4}$/.test(t.substr(pos,5))){ // 20180504 mwm add ////
              if(t[pos+1] != '/')
                state_crops.bushiness = t.substr(pos+1,2);
              if(t[pos+3] != '/')
                state_crops.shoots_inflorescences = t.substr(pos+3,2);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 5 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
          if (t[pos] == '6')
            if (/^6\d{4}$/.test(t.substr(pos,5))){
              state_crops.grain1000_mass = t.substr(pos+1,3)+'.'+t[pos+4];
              pos += 6;
            }else {
              errors.push("Ошибка в группе 6 зоны 92["+(i+1)+"]-93 раздела 2");
              return code = false;
            }
        }
        if (/ 94/.test(t.substr(pos-1,3))){ // zone 94 
          if (/^94[0-9/]{3}$/.test(t.substr(pos,5))){ // 20181011 add / согласовано с В.И.
            state_crops.moisture_reserve_10 = t.substr(pos+2,3);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 94 зоны 92["+(i+1)+"] раздела 2");
            return code = false;
          }
          if (t[pos] == '1')
            if (/^1[0-9/]{3}\d$/.test(t.substr(pos,5))){  // 20181011 add / согласовано с В.И.
              state_crops.moisture_reserve_5 = t.substr(pos+1,3);
              state_crops.soil_index = t[pos+4];
              pos += 6;
            }else {
              errors.push("Ошибка в группе 1 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          if (t[pos] == '2')
            if (/^2\d{4}$/.test(t.substr(pos,5))){
              state_crops.moisture_reserve_2 = t.substr(pos+1,2);
              state_crops.moisture_reserve_1 = t.substr(pos+3,2);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 2 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          if (t[pos] == '3')
            if (/^3\d{2}\/\/$/.test(t.substr(pos,5))){
              pos += 6;
            }else {
              errors.push("Ошибка в группе 3 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          if (t[pos] == '4')
            if (/^4\d{4}$/.test(t.substr(pos,5)) && (state_crops.crop_code == '008')){
              state_crops.temperature_water_2 = t.substr(pos+1,2);
              state_crops.depth_water = t.substr(pos+3,2);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 4 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          if (t[pos] == '5')
            if (/^5\d{4}$/.test(t.substr(pos,5))){
              state_crops.depth_groundwater = t.substr(pos+1,4);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 5 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          if (t[pos] == '6')
            if (/^6\d{3}\/$/.test(t.substr(pos,5))){
              state_crops.depth_thawing_soil = t.substr(pos+1,3);
              pos += 6;
            }else {
              errors.push("Ошибка в группе 6 зоны 92["+(i+1)+"]-94 раздела 2");
              return code = false;
            }
          // if (t[pos] == '7')
          //   if (/^7\d{3}\/$/.test(t.substr(pos,5))){
          //     state_crops.depth_soil_wetting = t.substr(pos+1,3);
          //     pos += 6;
          //   }else {
          //     errors.push("Ошибка в группе 7 зоны 92["+(i+1)+"]-94 раздела 2");
          //     return code = false;
          //   }
        }
        if (/ 95/.test(t.substr(pos-1,3))){ // zone 95
          if (/^95[0-9/]{3}$/.test(t.substr(pos,5))){
            state_crops.height_snow_cover = t.substr(pos+2,3);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 95 зоны 92["+(i+1)+"] раздела 2");
            return code = false;
          }
        if (t[pos] == '1')
          if (/^1[1-3]\d[0-9/]{2}$/.test(t.substr(pos,5))){
            state_crops.snow_retention = t[pos+1];
            state_crops.snow_cover = t[pos+2];
            if(t[pos+3] != '/')
              state_crops.snow_cover_density = '0.'+t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 1 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '2')
          if (/^2\d{4}$/.test(t.substr(pos,5))){
            state_crops.number_measurements_0 = t[pos+1];
            state_crops.number_measurements_3 = t[pos+2];
            state_crops.number_measurements_30 = t[pos+3];
            // if (t[pos+4] != '/')
              state_crops.ice_crust = t[pos+4];
            pos += 6;
          }else {
            errors.push("Ошибка в группе 2 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '3')
          if (/^3\d{4}$/.test(t.substr(pos,5))){
            // if (t[pos+1] != '/')
              state_crops.thickness_ice_cake = t.substr(pos+1,2);
            state_crops.depth_thawing_soil_2 = t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 3 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '4')
          if (/^4\d{3}[0-9/]$/.test(t.substr(pos,5))){
            state_crops.depth_soil_freezing = t.substr(pos+1,3);
            if (t[pos+4] != '/')
              state_crops.thaw_days = t[pos+4];
            pos += 6;
          }else {
            errors.push("Ошибка в группе 4 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '5')
          if (/^5[12][01]\d\d$/.test(t.substr(pos,5))){
            state_crops.thermometer_index = t[pos+1];
            state_crops.temperature_dec_min_soil3 = sign[t[pos+2]]+t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 5 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '6')
          if (/^6\d{3}[0-9/]$/.test(t.substr(pos,5))){
            state_crops.height_snow_cover_rail = t.substr(pos+1,3);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 6 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '7')
          if (/^7[12389][0-9/]\d{2}$/.test(t.substr(pos,5))){ // 20180303 mwm add /
            state_crops.viable_method = t[pos+1];
            if(t[pos+2]!='/')
              state_crops.soil_index_2 = t[pos+2];
            state_crops.losses_1 = t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 7 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '8')
          if (/^8[0-9/]{2}\d{2}$/.test(t.substr(pos,5))){  // 20180303 mwm add //
            if(t[pos+1]!='/')
              state_crops.losses_2 = t.substr(pos+1,2);
            state_crops.losses_3 = t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 8 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        if (t[pos] == '0')
          if (/^0\d\d[0-9/]{2}$/.test(t.substr(pos,5))){
            state_crops.losses_4 = t.substr(pos+1,2);
            if (t[pos+3] != '/')
              state_crops.temperature_dead50 = t.substr(pos+3,2);
            pos += 6;
          }else {
            errors.push("Ошибка в группе 0 зоны 92["+(i+1)+"]-95 раздела 2");
            return code = false;
          }
        }
        if (pos < t.length){
          errors.push("Ошибка в зоне 92["+(i+1)+"] раздела 2 pos=>"+pos+"; length=>"+t.length+" t=>"+t.substr(pos));
          code = false;
        } else{
          currentPos += t.length+(i<zone.length-1 ? 3:2);
          observation.state_crops.push(state_crops);
        }
      });
      if (!code)
        return false;
      
    }else{
      errors.push("Отсутствует обязательная зона 92 раздела 2");
      return false;
    }
    if ((tlg[currentPos-1] == '='))
      return true;
    else {
      errors.push("Ошибка в окончании телеграммы =>"+tlg.substr(currentPos));
      return false;
    }
  }
}
