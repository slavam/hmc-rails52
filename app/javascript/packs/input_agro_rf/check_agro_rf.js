export function checkAgroRf(tlg, stations, errors, observation){
  let currentPos;
  let sign = ['','-']
  let station;
  station = stations.find(s => +(tlg.substr(0,5))===s.value)
  if(station)
    observation.station_id = station.id
  else {
    errors.push("Ошибка в коде станции");
    return false;
  }
  if (tlg.substr(11,5) != ' 333 '){
    errors.push("Ошибка в признаке раздела 3");
    return false;
  }
  if (/^90[01]\d{2}$/.test(tlg.substr(16,5)))
    observation.temperature_max_12 = sign[+tlg[18]]+tlg.substr(19,2);
  else{
    errors.push("Ошибка в разделе 3 зона 90 =>"+tlg.substr(16,5)+"<=")
    return false;
  }
  currentPos = 22;
  if (tlg[currentPos] == '1') 
    if (/^1[01]\d{3}$/.test(tlg.substr(currentPos,5))){
      observation.temperature_avg_24 = sign[+tlg[currentPos+1]]+tlg.substr(currentPos+2,2)+'.'+tlg[currentPos+4];
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 1 зоны 90 раздела 3 =>"+tlg.substr(currentPos,5)+"<=")
      return false;
    }
  if (tlg[currentPos] == '3') 
    if (/^3[01]\d{2}\/$/.test(tlg.substr(currentPos,5))){
      observation.temperature_min_24 = sign[+tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 3 зоны 90 раздела 3 =>"+tlg.substr(currentPos,5)+"<=")
      return false;
    }
  if (tlg[currentPos] == '4') 
    if (/^4[01]\d{2}\/$/.test(tlg.substr(currentPos,5))){
      observation.temperature_min_soil_24 = sign[tlg[currentPos+1]]+tlg.substr(currentPos+2,2);
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 4 зоны 90 раздела 3 =>"+tlg.substr(currentPos,5)+"<=")
      return false;
    }
  // if (tlg[currentPos] == '5') 
    if (/^5\d{3}[1-5/]$/.test(tlg.substr(currentPos,5))){
      observation.percipitation_24 = tlg.substr(currentPos+1,3);
      observation.percipitation_type = tlg[currentPos+4] == '/' ? null : tlg[currentPos+4];
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 5 зоны 90 раздела 3 =>"+tlg.substr(currentPos,5)+"<=")
      return false;
    }
  if (tlg[currentPos] == '6') 
    if (/^6\d{3}[1-5]$/.test(tlg.substr(currentPos,5))){
      observation.percipitation_12 = tlg.substr(currentPos+1,3);
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 6 зоны 90 раздела 3 =>"+tlg.substr(currentPos,5)+"<=")
      return false;
    }
  // if (tlg[currentPos] == '7')  // 20181115
    if (/^7\d{4}$/.test(tlg.substr(currentPos,5))){
      observation.wind_speed_max_24 = tlg.substr(currentPos+1,2);
      observation.saturation_deficit_max_24 = tlg.substr(currentPos+3,2);
      currentPos += 6;
    }else{
      errors.push("Ошибка в обязательной группе 7 зоны 90 раздела 3 =>"+tlg.substr(currentPos)+"<=")
      return false;
    }
  if (tlg[currentPos] == '8') 
    if (/^8\d{2}[012/]{2}$/.test(tlg.substr(currentPos,5))){ // 20180530 added '/' согласовал с Б.Л.Н.
      observation.duration_dew_24 = tlg.substr(currentPos+1,2);
      if (tlg[currentPos+3] != '/')
        observation.dew_intensity_max = tlg[currentPos+3];
      if (tlg[currentPos+4] != '/')
        observation.dew_intensity_8 = tlg[currentPos+4];
      currentPos += 6;
    }else{
      errors.push("Ошибка в группе 8 зоны 90 раздела 3 =>"+tlg.substr(currentPos)+"<=")
      return false;
    }
  if(tlg[currentPos-1]=='=')
    return true
  if (tlg[currentPos] != '9'){ // 20181115 fixed
    errors.push("Ошибка в конце зоны 90 раздела 3 =>"+tlg.substr(currentPos)+"<=");
    return false;
  }
  if (tlg.substr(currentPos, 2) == '91'){
    if (/^91[0-9/]{2}[0-6/]$/.test(tlg.substr(currentPos,5))){
      if (tlg.substr(currentPos+2,2) != '//')
        observation.sunshine_duration_24 = tlg.substr(currentPos+2,2);
      if (tlg[currentPos+4] != '/')
        observation.state_top_layer_soil = tlg[currentPos+4];
      currentPos += 6;
    } else {
      errors.push("Ошибка в разделе 3 зона 91 =>"+tlg.substr(currentPos)+"<=")
      return false;
    }      
    if (tlg[currentPos] == '1') 
      if (/^1[0-9/]{4}$/.test(tlg.substr(currentPos,5))){ //20190419 возможны //// В.И.
        if (tlg[currentPos+1] != '/')
          observation.temperature_field_5_16 = tlg.substr(currentPos+1,2);
        if (tlg[currentPos+3] != '/')
          observation.temperature_field_10_16 = tlg.substr(currentPos+3,2);
        currentPos += 6;
      } else {
        errors.push("Ошибка в группе 1 зоны 91 раздела 3 =>"+tlg.substr(currentPos)+"<=")
        return false;
      }
    if (tlg[currentPos] == '2') 
      if (/^2[0-9/]{4}$/.test(tlg.substr(currentPos,5))){ //20180412 возможны //// В.И.
        if (tlg[currentPos+1] != '/')  
          observation.temperature_avg_soil_5 = tlg.substr(currentPos+1,2);
        if (tlg[currentPos+3] != '/')
          observation.temperature_avg_soil_10 = tlg.substr(currentPos+3,2);
        currentPos += 6;
      } else {
        errors.push("Ошибка в группе 2 зоны 91 раздела 3 =>"+tlg.substr(currentPos)+"<=")
        return false;
      }
    if (tlg[currentPos] == '3') //&& (tlg.substr(currentPos,4) != '333 ' ))
      if (/^3\d{4}$/.test(tlg.substr(currentPos,5))){
        observation.saturation_deficit_avg_24 = tlg.substr(currentPos+1,2);
        observation.relative_humidity_min_24 = tlg.substr(currentPos+3,2);
        currentPos += 6;
      } else {
        errors.push("Ошибка в группе 3 зоны 91 раздела 3 =>"+tlg.substr(currentPos)+"<=")
        return false;
      }
    if ((tlg.substr(currentPos,2) == '92') || (tlg[currentPos-1] == '=')){ // mwm 20180618
    } else { 
      errors.push("Ошибка в конце зоны 91 раздела 3 =>"+tlg.substr(currentPos)+"<=")
      return false;
    }
  }

  let zone92pos = tlg.search(/92... [1678]/);
  let zone92_95pos = tlg.search(/92... 95/);
  let end92pos;
  if (zone92pos > 0){
    if (zone92_95pos > 0)
      end92pos = zone92_95pos;
    else
      end92pos = tlg.length;
    currentPos = end92pos;
    let zone = tlg.substr(zone92pos-1,end92pos-zone92pos).split(' 92'); //20180710 mwm
    zone.splice(0,1);
    var state_crops;
    observation.state_crops = [];
    let code = true;
    zone.forEach((t, i) => {
      state_crops = {};
      state_crops.crop_code = t.substr(0, 3);
      let pos = 4;
      let j = 1;
      while (t.indexOf(' 1', pos-1)>0){
        if((j<6) && (/^1\d{2}[1-5/]{2}$/.test(t.substr(pos,5)))){ // 20180405 В.И. на позиции 4 допустима /
          state_crops["development_phase_"+j] = t.substr(pos+1,2);
          if(t[pos+3] != '/')
            state_crops["assessment_condition_"+j] = t[pos+3];
          j += 1;
          pos += 6;
        }else {
          errors.push("Ошибка в группе 1["+j+"] зоны 92["+(i+1)+"] раздела 3 "+t.substr(pos,5));
          return code = false;
        }
      }
      
      j = 1;
      while (t.indexOf(' 6', pos-1)>0){
        if((j<6) && (/^6\d{3}[234]$/.test(t.substr(pos,5)))){
          state_crops["agricultural_work_"+j] = t.substr(pos+1,3);
          state_crops["index_weather_"+j] = t[pos+4];
          j += 1;
          pos += 6;
        }else {
          errors.push("Ошибка в группе 6["+j+"] зоны 92["+(i+1)+"] раздела 3 =>"+t.substr(pos,5));
          return code = false;
        }
      }
      
      j = 1;
      while (t.indexOf(' 7', pos-1)>0){
        if((j<6) && (/^7\d{3}[1-5]$/.test(t.substr(pos,5)))){
          state_crops["damage_plants_"+j] = t.substr(pos+1,3);
          state_crops["damage_volume_"+j] = t[pos+4];
          j += 1;
          pos += 6;
        }else {
          errors.push("Ошибка в группе 7["+j+"] зоны 92["+(i+1)+"] раздела 3 =>"+t.substr(pos,5));
          return code = false;
        }
      }
      
      if (pos < t.length){
        errors.push("Ошибка в зоне 92["+(i+1)+"] раздела 3 =>"+t.substr(pos));
        code = false;
      } else
        observation.state_crops.push(state_crops);
    });
    if (!code)
      return false;
  }
  
  if (zone92_95pos > 0){
    end92pos = tlg.length;
    currentPos = end92pos;
    let zone = tlg.substr(zone92_95pos-1,end92pos-zone92_95pos).split(' 92'); // 20180710 mwm
    zone.splice(0,1);
    observation.crop_damages = [];
    let crop_damages;
    let code = true;
    zone.forEach((t, i) => {
      crop_damages = {};
      crop_damages.crop_code = t.substr(0, 3);
      let pos = 4;
      if( (/^95[0-9/]{3}$/.test(t.substr(pos,5)))){ // добавил /// по согласованию с В.И. 2018.02.28 (см. стр. 35)
        if (t[pos+2] != '/')
          crop_damages.height_snow_cover_rail = t.substr(pos+2,3);
        pos += 6;
      }else {
        errors.push("Ошибка в группе 95 зоны 92_95["+(i+1)+"] раздела 3 =>"+t.substr(pos));
        return code = false;
      }
      
      if (t[pos] == '4')
        if( (/^4\d{3}\/$/.test(t.substr(pos,5)))){
          crop_damages.depth_soil_freezing = t.substr(pos+1,3);
          pos += 6;
        }else {
          errors.push("Ошибка в группе 4 зоны 92_95["+(i+1)+"] раздела 3 =>"+t.substr(pos));
          return code = false;
        }
      
      if (t[pos] == '5')
        if( (/^5[12][01]\d{2}$/.test(t.substr(pos,5)))){
          crop_damages.thermometer_index = t[pos+1];
          crop_damages.temperature_dec_min_soil3 = sign[t[pos+2]]+t.substr(pos+3,2);
          pos += 6;
        }else {
          errors.push("Ошибка в группе 5 зоны 92_95["+(i+1)+"] раздела 3 =>"+t.substr(pos));
          return code = false;
        }
        
      if (pos < t.length){
        errors.push("Ошибка в зоне 92_95["+(i+1)+"] раздела 3 =>"+t.substr(pos));
        code = false;
      } else
        observation.crop_damages.push(crop_damages);
    });
    if (!code)
      return false;
  }
  
  if(tlg[currentPos-1] == '=')
    return true;
  else {
    errors.push("Ошибка в окончании телеграммы =>"+tlg.substr(currentPos));
    return false;
  }
}