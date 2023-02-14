import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Select from "react-select"
import { checkAgroRf } from './check_agro_rf'

const LastAgroRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    rows.push(<tr key={t.id}>
      <td>{t.date_dev.substr(0,10)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{station.label}</td>
      <td><a href={'/agro_observations/'+t.id}>{t.telegram}</a></td></tr>)
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th width = "200px">Дата наблюдения</th>
          <th width = "200px">Дата/время вода (UTC)</th>
          <th>Метеостанция</th>
          <th>Текст</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
export const InputAgroRf=({telegrams, stations, currStationId})=>{
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  let today = new Date().toJSON().slice(0,10)
  const [observationDate, setObservationDate] = useState(today)
  let cs = currStationId==0? stations[0] : stations.find(s => s.id === currStationId)
  const [station, setStation] = useState(cs) //stations[0])
  const [telegramNum, setTelegramNum] = useState(1)
  let templ = '90sTT 1sTTT 3sTT/ 4sTT/ 5000/ 7ffDD='
  const [zone9095, setZone9095] = useState(templ)
  let od = observationDate
  od = `${od.slice(8,10)}${od.slice(5,7)}${telegramNum} 333`
  const telegram = `AAEE ${station.value} ${od}`
  const dateChanged = (e)=>{
    setObservationDate(e.target.value)
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const telegramNumChanged=(e)=>{
    setTelegramNum(e.target.value)
  }
  const onZone9095Changed=(e)=>{
    setZone9095(e.target.value)
  }
  const saveAgroObservation=()=>{
    let errors = []
    const fullTelegram = `${telegram.trim().substring(5)} ${zone9095.trim()}`
    let observation = {}
    
    if(checkAgroRf(fullTelegram, stations, errors, observation)){
      // alert('OK')
      // return
      observation.telegram = fullTelegram
      observation.date_dev = observationDate
      observation.day_obs = +observationDate.substring(8,10)
      observation.month_obs = +observationDate.substring(5,7)
      observation.telegram_num = telegramNum
      observation.telegram_type = 'AAEE'
      $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {agro_observation: observation},
        url: "/agro_observations/create_agro_rf"
        }).done((data) => {
          setTelegramNum(1)
          setZone9095(templ)
          if(data.telegrams)
            setLastTelegrams(data.telegrams)
          alert(data.errors[0])
        }).fail((res) => {
          alert("Ошибка записи в базу")
        });
    }else{
      alert(errors[0])
    }
  }
  App.candidate = App.cable.subscriptions.create({
      channel: "SynopticTelegramChannel", 
    },
    {received: data => {
        if(data.tlgType==='agro_rf')
          setLastTelegrams([data.telegram].concat(lastTelegrams))
      }
    }
  )
  return(
    <div>
      <h1>Ввод ежедневных агрометеорологических данных</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="250px">Дата наблюдения</th>
            <th width="100px">Номер телеграммы</th>
            <th>Метеостанция</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="date" value={observationDate} onChange={dateChanged} /></td>
            <td><input type="number" value={telegramNum} step='1' max='9' min='1' onChange={telegramNumChanged} /></td>
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p><b>{telegram}</b></p>
        <input type="text" value={zone9095} id='zone9095' onChange={onZone9095Changed}/>
        <button type="button" onClick={saveAgroObservation}>Сохранить</button>
      </div>
      <h1 color="black">Последние наблюдения</h1>
      <LastAgroRf lastTelegrams={lastTelegrams} stations={stations} />
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
      <InputAgroRf telegrams={telegrams} stations={stations} currStationId={currStationId}/>,
      document.getElementById('root')
    )
  }
})