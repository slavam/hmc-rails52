import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
// import './input_storm_rf.css'
import { checkStormRf } from './check_storm_rf';

const LastStormsRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let stationName = stations.find(s => s.id === t.station_id).label
    rows.push(<tr key={t.id}>
      <td>{t.telegram_date.replace(/T/, " ").substr(0,16)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{stationName}</td>
      <td>{t.telegram}</td></tr>)
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

const eventArray = [
  {label: "10 Сильный ветер", value: 10, isDangerous: false},
  {label: <b>11 Очень сильный ветер</b>, value: 11, isDangerous: true},
  {label: <b>12 Ураганный ветер</b>, value: 12, isDangerous: true},
  {label: "16 Шквал, НГЯ", value: 16, isDangerous: false},
  {label: <b>17 Шквал, ОЯ</b>, value: 17, isDangerous: true},
  {label: <b>18 Смерч над водной поверхностью</b>, value: 18, isDangerous: true},
  {label: <b>19 Смерч над сушей</b>, value: 19, isDangerous: true},
  {label: <b>21 Сильная жара</b>, value: 21, isDangerous: true},
  {label: <b>22 Аномально-жаркая погода</b>, value: 22, isDangerous: true},
  {label: <b>24 Чрезвычайная пожарная опасность</b>, value: 24, isDangerous: true},
  {label: <b>25 Сильный мороз</b>, value: 25, isDangerous: true},
  {label: <b>26 Аномально-холодная погода</b>, value: 26, isDangerous: true},
  {label: "30 Низкая облачность при 5 баллах и более", value: 30, isDangerous: false},
  // {label: "", value:, isDangerous:},
  // {label: "", value:, isDangerous:},
]
export function InputStormRf({telegrams, stations}){
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  const [eventWarep, setEventWarep] = useState(eventArray[0])
  const [isStart, setIsStart] = useState(true)
  const [eventDate, setEventDate] = useState(new Date())
  const [station, setStation] = useState(stations[0])
  const [tail, setTail] = useState('1ddffFF=')
  let ed = eventDate.toISOString()
  ed = `${ed.substr(2, 2)}${ed.substr(5, 2)} ${ed.substr(8, 2)}${ed.substr(11, 2)}${ed.substr(14, 2)}`
  const telegram = `${isStart? 'WW':'WO'}${eventWarep.isDangerous? 'HP':'AP'} ${ed} ${station.value} ${eventWarep.value}`
  const onStartChanged = (e) => {
    setIsStart(e.currentTarget.value)
  }
  const onEndChanged = (e) => {
    setIsStart(!e.currentTarget.value)
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const handleEventSelected = (val)=>{
    setEventWarep(val)
    switch (+val.value) {
      case 10:
      case 11:
      case 12:
        setTail('1ddffFF=')
        break
      case 16:
      case 17:
        setTail('1ddffFF 2DDww=')
        break
      case 18:
      case 19:
        setTail('1ddffFF 2DDww=')
        break
      case 21:
        setTail('4sTTT=')
        break
      case 22:
        setTail('4sTTT 7VVttt=')
        break
      // case 24:
      //   setTail('=')
      //   break
      case 25:
        setTail('5sTTT=')
        break
      case 26:
        setTail('5sTTT 7VVttt=')
        break
      // case 30:                
      default:
        setTail('=')
    }
  }
  const onTailChanged = (e)=>{
    setTail(e.target.value)
  }
  const saveStormMessage = ()=>{
    let error = []
    if(checkStormRf(+eventWarep.value, tail, error)){
      // check eventDate < currDate
      let message = {telegram_type: telegram.substr(0,4),
        station_id: station.id,
        telegram: telegram+(tail.length==1?'':' ')+tail,
        telegram_date: eventDate.toISOString().replace('T',' ').substr(0,17)+'00'}
      $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {storm_observation: message},
        url: "/storm_observations/create_storm_rf"
        }).done((data) => {
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
  const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    // alert(JSON.stringify(data))
    setLastTelegrams([data.telegram].concat(lastTelegrams))
    snd.play();
  }
  });
  return(
    <div>
      <h1 color="black">Ввод штормовых сообщений</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="150px">Начало/
                              Окончание</th>
            <th width="300px">Дата и время явления</th>
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
            <td><DatePicker selected={eventDate} onChange={date => setEventDate(date)} locale={ru}
              showTimeSelect
              timeFormat="p"
              timeIntervals={1}
              dateFormat="Pp" />
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
    
    ReactDOM.render(
      <InputStormRf telegrams={telegrams} stations={stations} />,
      document.getElementById('root')
    );
  }
});