import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Select from "react-select"
import { checkAgroDecRf } from './check_agro_dec_rf'

const LastAgroDecRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    rows.push(<tr key={t.id}>
      <td>{t.date_dev.substr(0,10)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{station.label}</td>
      <td><a href={'/agro_dec_observations/'+t.id}>{t.telegram}</a></td></tr>)
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
export const InputAgroDecRf=({telegrams, stations, reportDate})=>{
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  const [observationDate, setObservationDate] = useState(reportDate)
  const [station, setStation] = useState(stations[0])
  const [telegramNum, setTelegramNum] = useState(1)
  const [zone90, setZone90] = useState('90sTT 1sTTT 2sTTn 3sTTn 4sTTn 5000/ 8ffnm')
  const [zone91, setZone91] = useState('=')
  let od = observationDate
  od = `${od.slice(8,10)}${od.slice(5,7)}${telegramNum} 111`
  const telegram = `AADD ${station.value} ${od}`
  const dateChanged = (e)=>{
    setObservationDate(e.target.value)
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const telegramNumChanged=(e)=>{
    setTelegramNum(e.target.value)
  }
  const onZone90Changed=(e)=>{
    setZone90(e.target.value)
  }
  const onZone91Changed=(e)=>{
    setZone91(e.target.value)
  }
  const saveAgroDecObservation=()=>{
    let errors = []
    let con1 = zone91.length>1? ' ':''
    let fullTelegram = `${telegram.trim().substring(5)} ${zone90.trim()}${con1}${zone91.trim()}`
    let observation = {}
    if(checkAgroDecRf(fullTelegram, stations, errors, observation)){
      alert('OK')
      // postObservation(fullTelegram)
    }else{
      alert(errors[0])
    }
  }
  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    if(data.tlgType==='agro_dec'){
      setLastTelegrams([data.telegram].concat(lastTelegrams))
    }
  }
  })
  return(
    <div>
      <h1>Ввод декадных агрометеорологических данных</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="250px">Дата наблюдения</th>
            <th width="100px">Номер телеграммы</th>
            <th>Метеостанция</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="date" value={observationDate} onChange={dateChanged} /></td>
            <td><input type="number" value={telegramNum} step='1' max='9' min='1' onChange={telegramNumChanged} /></td>
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p><b>{telegram}</b></p>
        <table className="table table-hover">
          <thead>
            <tr>
              <th rowSpan={2}>Раздел 1:</th>
              <th>Зона 90</th>
              <th><input type="text" value={zone90} id='zone90' onChange={onZone90Changed}/></th>
            </tr>
            <tr>
              <th>Зона 91</th>
              <th><input type="text" value={zone91} id='zone91' onChange={onZone91Changed}/></th>
            </tr>
          </thead>
        </table>
        <button type="button" onClick={saveAgroDecObservation}>Сохранить</button>
      </div>
      <h1 color="black">Последние наблюдения</h1>
      <LastAgroDecRf lastTelegrams={lastTelegrams} stations={stations} />
    </div>
  )
}
$(function () {
  const node = document.getElementById('init-params');
  if(node) {
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const reportDate = JSON.parse(node.getAttribute('reportDate'));
    ReactDOM.render(
      <InputAgroDecRf telegrams={telegrams} stations={stations} reportDate={reportDate}/>,
      document.getElementById('root')
    )
  }
})