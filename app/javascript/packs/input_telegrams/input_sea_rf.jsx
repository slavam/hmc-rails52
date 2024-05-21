import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import { checkSeaRf } from './check_sea_rf';
import { copyToClipboard } from '../synoptic_data/about_clipboard';

const LastSeaRf = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    rows.push(<tr key={t.id}>
      <td>{t.date_dev.replace(/T/, " ").substr(0,16)}</td>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{station.label}</td>
      <td><a href={'/sea_observations/'+t.id}>{t.telegram}</a></td></tr>)
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th width = "200px">Дата/срок наблюдения (UTC)</th>
          <th width = "200px">Дата/время вода (UTC)</th>
          <th>Метеостанция</th>
          <th>Текст</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export const InputSeaRf=({telegrams})=>{
  const stations = [
    {label: "Мариуполь", value: 34712, id: 5},
    {label: "Седово", value: 34721, id: 10}
  ]
  const terms = [
    {label: '00', value:0},
    {label: '06', value:6},
    {label: '12', value:12},
    {label: '18', value:18},
  ]
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  const [observationDate, setObservationDate] = useState(new Date().toISOString().slice(0,10))
  const [station, setStation] = useState(stations[0])
  const [term, setTerm] = useState(terms[0])
  const [section1, setSection1] = useState('0110 1ddff 2ffVW 3sTTT 4sTTT 8ashhh')
  const [section2, setSection2] = useState('')
  const [section3, setSection3] = useState('=')
  let od = observationDate
  od = `${od.slice(2,4)}${od.slice(5,7)}${od.slice(8,10)} ${term.label}00`
  const telegram = `SEA ${od} ${station.value}`
  const dateChanged = (e)=>{
    setObservationDate(e.target.value)
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const handleTermSelected =(val)=>{
    setTerm(val)
  }
  const onSection1Changed=(e)=>{
    setSection1(e.target.value)
  }
  const onSection2Changed=(e)=>{
    setSection2(e.target.value)
  }
  const onSection3Changed=(e)=>{
    setSection3(e.target.value)
  }
  
  const postObservation=(text)=>{
    let message = {
      station_id: station.id,
      telegram: text,
      term: term.value,
      day_obs: observationDate.slice(8,10),
      date_dev: `${observationDate.slice(0,10)} ${term.label}:00:00`
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {sea_observation: message},
      url: "/sea_observations/create_sea_rf"
    }).done((data) => {
      setSection1('0110 1ddff 2ffVW 3sTTT 4sTTT 8ashhh')
      setSection2('')
      setSection3('=')  
      if(data.telegrams)
        setLastTelegrams(data.telegrams);
      alert(data.errors[0])
    }).fail((res) => {
      alert("Ошибка записи в базу")
    });

  }
  const saveSeaMessage=()=>{
    let error = []
    if(checkSeaRf(section1, section2, section3, term.value, error)){
      let con1 = section2.length>0? ' ':''
      let con2 = section3.length>1? ' ':''
      let fullTelegram = `${telegram.trim()} ${section1.trim()}${con1}${section2.trim()}${con2}${section3.trim()}`
      postObservation(fullTelegram)
    }else{
      alert(error[0])
    }
  }
  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    if(data.tlgType=='sea'){
      setLastTelegrams([data.telegram].concat(lastTelegrams))
    }
  }
  });
  const toClipboard = (e) =>{
    let text = ""
    let message = ''
    let ts = []
    ts = lastTelegrams.filter(t => observationDate===t.date_dev.substr(0,10) && term.value===t.term)
    message = `Скопировано ${ts.length} SEA тлг. за ${observationDate} (${term.value})`
    ts.forEach((t) => {text += t.telegram+'\n'})
    copyToClipboard(text)
    alert(message);
  }
  return(
    <div>
      <h1>Ввод данных о морских наблюдениях</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="250px">Дата наблюдения (UTC)</th>
            <th width="100px" margin="10px">Срок</th>
            <th width="250px">Метеостанция</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="date" value={observationDate} onChange={dateChanged} /></td>
            <td><Select value={term} onChange={handleTermSelected} options={terms} /></td>
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p><b>{telegram}</b></p>
        <table className="table table-hover">
          <tbody>
            <tr>
              <th width="80px">Раздел 1:</th>
              <th><input type="text" value={section1} id='section1' onChange={onSection1Changed}/></th>
            </tr>
            <tr>
              <th width="80px">Раздел 2:</th>
              <th><input type="text" value={section2} id='section2' onChange={onSection2Changed}/></th>
            </tr>
            <tr>
              <th width="80px">Раздел 3:</th>
              <th><input type="text" value={section3} id='section3' onChange={onSection3Changed}/></th>
            </tr>
          </tbody>
        </table>
        <button type="button" onClick={saveSeaMessage}>Сохранить</button>
      </div>
      <h1 color="black">Последние наблюдения</h1>
      <button onClick={event => toClipboard(event)}>Скопировать последние</button>
      <LastSeaRf lastTelegrams={lastTelegrams} stations={stations} />
    </div>
  )
}
$(function () {
  const node = document.getElementById('init-params');
  if(node) {
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    
    ReactDOM.render(
      <InputSeaRf telegrams={telegrams} />,
      document.getElementById('root')
    );
  }
});