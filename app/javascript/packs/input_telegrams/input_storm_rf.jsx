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
      case 24:
        setTail('=')
        break
      case 25:
        setTail('5sTTT=')
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
    if(checkStormRf(+eventWarep.value, tail, error)){
      let message = {telegram_type: telegram.substr(0,4),
        station_id: station.id,
        telegram: telegram+(tail.length==1?'':' ')+tail,
        telegram_date: eventDate.toISOString().replace('T',' ').substr(0,19)}
      $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {storm_observation: message},
        url: "/storm_observations/create_storm_rf"
        }).done((data) => {
          setLastTelegrams(data.telegrams);
        }).fail((res) => {
          alert("Ошибка записи в базу")
        });
    }else{
      alert(error[0])
    }
  }
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
    // const currDate = JSON.parse(node.getAttribute('currDate'));
    // const tlgType = JSON.parse(node.getAttribute('tlgType'));
    const stations = JSON.parse(node.getAttribute('stations'));
    // const inputMode = JSON.parse(node.getAttribute('inputMode'));
    // const codeStation = JSON.parse(node.getAttribute('codeStation'));
    
    ReactDOM.render(
      <InputStormRf telegrams={telegrams} stations={stations} />,
      document.getElementById('root')
    );
  }
});