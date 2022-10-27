import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import ru from 'date-fns/locale/ru';
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
  {label: "31 Закрытие гор, перевалов облаками, осадками, туманом", value: 31, isDangerous: false},
  {label: "35 Пыльная (песчаная) буря", value: 35, isDangerous: false},
  {label: <b>36 Сильная пыльная (песчаная) буря</b>, value: 36, isDangerous: true},
  {label: "37 Метель низовая", value: 37, isDangerous: false},
  {label: "38 Метель общая", value: 38, isDangerous: false},
  {label: <b>39 Сильная метель</b>, value: 39, isDangerous: true},
  {label: "40 Ухудшение видимости при осадках", value: 40, isDangerous: false},
  {label: "41 Ухудшение видимости из-за дыма", value: 41, isDangerous: false},
  {label: "42 Ухудшение видимости из-за мглы", value: 42, isDangerous: false},
  {label: "43 Ухудшение видимости из-за дымки", value: 43, isDangerous: false},
  {label: "44 Ухудшение видимости из-за тумана", value: 44, isDangerous: false},
  {label: <b>47 Сильный туман</b>, value: 47, isDangerous: true},
  {label: "51 Гололедица на дорогах", value: 51, isDangerous: false},
  {label: "52 Изморозь", value: 52, isDangerous: false},
  {label: <b>53 Сильная изморозь</b>, value: 53, isDangerous: true},
  {label: "54 Гололед", value: 54, isDangerous: false},
  {label: <b>55 Сильный гололед</b>, value: 55, isDangerous: true},
  {label: "56 Отложение мокрого снега", value: 56, isDangerous: false},
  {label: <b>57 Сильное отложение мокрого снега</b>, value: 57, isDangerous: true},
  {label: "58 Сложное отложение", value: 58, isDangerous: false},
  {label: <b>59 Сильное сложное отложение</b>, value: 59, isDangerous: true},
  {label: <b>62 Продолжительный сильный дождь</b>, value: 62, isDangerous: true},
  {label: "63 Сильный дождь (дождь, ливневый дождь)", value: 63, isDangerous: false},
  {label: <b>64 Очень сильный дождь (дождь, ливневый дождь)</b>, value: 64, isDangerous: true},
  {label: "65 Сильные смешанные осадки (мокрый снег, дождь со снегом)", value: 65, isDangerous: false},
  {label: <b>66 Очень сильные смешанные осадки (мокрый снег, дождь со снегом)</b>, value: 66, isDangerous: true},
  {label: "68 Ледяной дождь", value: 68, isDangerous: false},
  {label: "81 Ливень", value: 81, isDangerous: false},
  {label: <b>82 Сильный ливень</b>, value: 82, isDangerous: true},
  {label: "85 Сильнй снег (снег, ливневый снег и др.)", value: 85, isDangerous: false},
  {label: <b>86 Очень сильный снег (снег, ливневый снег и др.)</b>, value: 86, isDangerous: true},
  {label: "89 Град", value: 89, isDangerous: false},
  {label: <b>90 Крупный град</b>, value: 90, isDangerous: true},
  {label: "91 Гроза на станции", value: 91, isDangerous: false},
  {label: "92 Гроза в окрестности", value: 92, isDangerous: false},
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
    setIsStart(true) //e.currentTarget.value)
    tailPattern(true,+eventWarep.value)
  }
  const onEndChanged = (e) => {
    setIsStart(false) //!e.currentTarget.value)
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
  const snd = new Audio("/assets/ring1.wav");
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
            <th width="300px">Дата и время явления (местное)</th>
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
            <td>
              <style>
                {`.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
                  padding-left: 0;
                  padding-right: 0;
                }`}
              </style>
              <DatePicker
                dateFormat="yyyy-MM-dd HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                selected={eventDate}
                onChange={date => setEventDate(date)} 
              />
            </td>
            {/* <td><DatePicker selected={eventDate} onChange={date => setEventDate(date)} locale={ru}
              showTimeSelect
              timeFormat="p"
              timeIntervals={1}
              dateFormat="Pp" />
            </td> */}
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
            <td><Select value={eventWarep} onChange={handleEventSelected} options={eventArray} /></td>
          </tr>
        </tbody>
      </table>
      <div>
        <form>
          <p><b>{telegram}</b></p>
          <input type="text" value={tail} onChange={onTailChanged}/>
          <button type="button" onClick={saveStormMessage}>Сохранить</button>
        </form>
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