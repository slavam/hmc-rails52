import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import ru from 'date-fns/locale/ru';
import { checkStormRf } from './check_storm_rf';
import { eventArray } from './storm_events'

const LastStormsRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    rows.push(<tr key={t.id}>
      <td>{t.telegram_date.replace(/T/, " ").substr(0,16)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{station.label}</td>
      <td><a href={'/storm_observations/'+t.id}>{t.telegram}</a></td></tr>)
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
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
        setTail(isStart?'2//ww 8NChh=':'8NChh=')
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
          setLastTelegrams(data.telegrams);
          // alert(data.doneMessage)
        }).fail((res) => {
          alert("Ошибка записи в базу")
        });
    }else{
      alert(error[0])
    }
  }
  const snd = new Audio("/assets/ring1.wav");
  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    if(data.tlgType=='storm'){
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