import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import ru from 'date-fns/locale/ru';
import { checkStormRf } from './check_storm_rf';
import { eventArray } from './storm_events'

const snd = new Audio("/assets/ring1.wav");
// const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
const LastStormsRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    let danger = t.telegram[2]=='A'? {backgroundColor: 'white'} : {backgroundColor: '#ff8888'}  
    rows.push(<tr key={t.id} style={danger}>
      <td>{t.telegram_date.replace(/T/, " ").substr(0,16)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{station.label}</td>
      <td><a href={'/storm_observations/'+t.id}>{t.telegram}</a></td></tr>)
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr >
          <th width = "200px">Дата/время явления (UTC)</th>
          <th width = "200px">Дата/время вода (UTC)</th>
          <th>Метеостанция</th>
          <th>Текст</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export function InputStormRf({telegrams, stations, currStationId}){
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  const [eventWarep, setEventWarep] = useState(eventArray[0])
  const [isStart, setIsStart] = useState(true)
  const [dtlEventDate, setDtlEventDate] = useState(new Date().toISOString().slice(0,-8))
  let cs = currStationId==0? stations[0] : stations.find(s => s.id === currStationId)
  const [station, setStation] = useState(cs)
  const [tail, setTail] = useState('1ddffFF=')
  let ed = dtlEventDate
  ed = `${ed.slice(2,4)}${ed.slice(5,7)} ${ed.slice(8,10)}${ed.slice(11,13)}${ed.slice(14,16)}`
  const telegram = `${isStart? 'WW':'WO'}${eventWarep.isDangerous? 'HP':'AP'} ${ed} ${station.value} ${eventWarep.value}`
  const onStartChanged = (e) => {
    setIsStart(true) 
    tailPattern(true,+eventWarep.value)
  }
  const onEndChanged = (e) => {
    setIsStart(false)
    tailPattern(false,+eventWarep.value)
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const handleEventSelected = (val)=>{
    setEventWarep(val)
    tailPattern(isStart,+val.value)
  }
  const tailPattern = (isStart,code)=>{
    switch (+code) {
      case 10:
      case 11:
      case 12:
        setTail(isStart?'1ddffFF=':'1ddffFF 7VVttt=')
        break
      case 16:
      case 17:
        setTail(isStart?'1ddffFF 2DDww=':'1ddffFF 2DDww 906tt=')
        break
      case 18:
      case 19:
        setTail('1ddffFF 2DDww=')
        break
      case 21:
        setTail(isStart?'4sTTT=':'4sTTT 7VVttt=')
        break
      case 22:
        setTail('4sTTT 7VVttt=')
        break
      // case 24:
      case 25:
        setTail(isStart?'5sTTT=':'5sTTT 7VVttt=')
        break
      case 26:
        setTail('5sTTT 7VVttt=')
        break
      case 30:
        setTail('2//ww 8NChh=')
        break
      case 31:
        setTail(isStart?'2//ww=':'=')
        break
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
        setTail('1ddffFF 7VVttt=')
        break
      case 40:
        setTail(isStart?'2//ww 7VVttt=':'7VVttt=')
        break
      case 41:
      case 42:
      case 43:
      // case 44:
      case 47:
        setTail('7VVttt=')
        break
      case 44:
        setTail(isStart?'7VVttt=':'7VVttt 8NCh/=')
        break
      case 51:
        setTail('3//sTT=')
        break
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 58:
      case 59:
        setTail(isStart?'1ddffFF 3RRsTT=':'1ddffFF 3RRsTT 7VVttt=')
        break
      case 62:
        setTail('6RRR/ 7VVttt=')
        break
      case 63:
      case 64:
      case 65:
      case 66:
        setTail('6RRR/ 906tt=')
        break
      case 68:
        setTail('3//sTT=')
        break
      case 81:
      case 82:
      case 85:
      case 86:
        setTail('6RRR/ 906tt=')
        break
      case 89:
        setTail(isStart?'=':'906tt 932RR=')
        break
      case 90:
        setTail('906tt 932RR=')
        break
      case 91:
      case 92:
          setTail('1ddffFF 2ddww=')
          break
      default:
        setTail('=')
    }
  }
  const onTailChanged = (e)=>{
    setTail(e.target.value)
  }
  const saveStormMessage = ()=>{
    let error = []
    if(checkStormRf(+eventWarep.value, tail, error, isStart)){
      // check eventDate < currDate
      let message = {telegram_type: telegram.slice(0,4),
        station_id: station.id,
        telegram: telegram+(tail.length==1?'':' ')+tail,
        telegram_date: dtlEventDate.replace('T',' ').slice(0,17)+':00'}
      $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {storm_observation: message},
        url: "/storm_observations/create_storm_rf"
        }).done((data) => {
          setIsStart(true)
          setEventWarep(eventArray[0])     
          setTail('1ddffFF=')  
          // setLastTelegrams(data.telegrams);
          alert("Сообщение добавлено")
        }).fail((res) => {
          alert("Ошибка записи в базу")
        });
    }else{
      alert(error[0])
    }
  }
  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    if(data.tlgType==='storm'){
      snd.play();
      snd.play();
      setLastTelegrams([data.telegram].concat(lastTelegrams))
    }
  }
  });
  const eventDateChanged = (e)=>{
    if (!e.target['validity'].valid) return;
    const dt= e.target['value'] + ':00Z';
    setDtlEventDate(dt);
  }
  return(
    <div>
      <h1 color="black">Ввод штормовых сообщений</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="150px">Начало/
                              Окончание</th>
            <th width="300px">Дата и время явления (UTC)</th>
            <th width="250px">Метеостанция</th>
            <th>Явление</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <section className='other'>
                <input id='start-event' type="radio" name="start-event" value={isStart} checked={isStart} onChange={onStartChanged} /> 
                <label align="left" htmlFor="start-event">Начало</label>
                <br/>
                <input id="end-event" type="radio" name="end-event" value={!isStart} checked={!isStart} onChange={onEndChanged} /> 
                <label htmlFor="end-event">Окончание</label>
              </section>
            </td>
            {/* <td> 
               <style>
                {`.my-class,
                .ant-calendar-input-wrap,
                .ant-calendar-footer {
                  display: none;
                }`}
              </style>
              <DatePicker
                className="my-class"
                dateFormat="yyyy-MM-dd HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                selected={eventDate}
                onChange={date => setEventDate(date)} 
              /> 
             </td> */}
            <td>
              <input type="datetime-local" 
                onChange={eventDateChanged} locale={ru} 
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                // value={dtlEventDate}
                defaultValue={dtlEventDate} />
            </td>
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
            <td><Select value={eventWarep} onChange={handleEventSelected} options={eventArray} /></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p><b>{telegram}</b></p>
        <input type="text" value={tail} onChange={onTailChanged}/>
        <button type="button" onClick={saveStormMessage}>Сохранить</button>
      </div>
      <h1 color="black">Последние шторма</h1>
      <LastStormsRf lastTelegrams={lastTelegrams} stations={stations} />
    </div>
  )
}

$(function () {
  const node = document.getElementById('init-params');
  if(node) {
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const currStationId = JSON.parse(node.getAttribute('currStationId'))
    
    ReactDOM.render(
      <InputStormRf telegrams={telegrams} stations={stations} currStationId={currStationId} />,
      document.getElementById('root')
    );
  }
});