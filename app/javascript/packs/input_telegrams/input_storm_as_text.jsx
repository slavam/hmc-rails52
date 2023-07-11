import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Select from "react-select"

const snd = new Audio("/assets/ring1.wav");
const LastAgroStorms = ({lastTelegrams, stations}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    let station = stations.find(s => s.id === t.station_id)
    let danger = t.telegram[3]!='Я'? {backgroundColor: 'white'} : {backgroundColor: '#ff8888'}  
    rows.push(<tr key={t.id} style={danger}>
      <td>{t.created_at.replace(/T/, " ").substr(0,19)}</td>
      <td>{t.telegram}</td></tr>)
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr >
          <th width = "200px">Дата/время вода (UTC)</th>
          <th>Текст</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export function InputStormRf({telegrams, stations, currStationId}){
  const stormTypes = [
    {label: 'Агрометеорологические', value: 'agro'},
    // {label: 'Гидрометеорологические', value: 'meteo'},
    // {label: 'Морские гидрометеорологические', value: 'sea'},
  ]
  const headerTypes = [
    {label: 'ЩЭНГЯ начало/усиление НГЯ', value: 'ЩЭНГЯ'},
    {label: 'ЩЭОЯЮ начало/усиление ОЯ', value: 'ЩЭОЯЮ'},
    {label: 'ЩЭШТЯ окончание НГЯ', value: 'ЩЭШТЯ'},
    {label: 'ЩЭШРВ окончание ОЯ', value: 'ЩЭШРВ'},
  ]
  const [lastTelegrams, setLastTelegrams] = useState(telegrams)
  const [stormType, setStormType] = useState(stormTypes[0])
  const [headerType, setHeaderType] = useState(headerTypes[0])
  let cs = currStationId==0? stations[0] : stations.find(s => s.id === currStationId)
  const [station, setStation] = useState(cs)
  const [tail, setTail] = useState('=')
  const telegram = `${headerType.value} ${station.label}`

  App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel", 
  },
  {received: data => {
    if(data.tlgType==='storm'){
      snd.play();
      setLastTelegrams([data.telegram].concat(lastTelegrams))
    }
  }
  });
  const saveStormMessage = ()=>{
    let maxDate = new Date().toISOString().replace('T',' ').slice(0,-5)
    let message = {
      telegram: telegram+(tail.length==1?'':' ')+tail,
      telegram_type: headerType.value,
      station_id: station.id,
      day_event: maxDate.slice(8,10),
      hour_event: maxDate.slice(11,13),
      minute_event: maxDate.slice(14,16),
      telegram_date: maxDate}
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {storm_observation: message},
      url: "/storm_observations/create_storm_as_text"
      }).done((data) => {
        setHeaderType(headerTypes[0])     
        setStation(cs)
        setTail('=')  
        alert("Сообщение добавлено")
      }).fail((res) => {
        alert("Ошибка записи в базу")
      });
  }
  const handleStationSelected = (val)=>{
    setStation(val)
  }
  const handleHeaderSelected = (val)=>{
    setHeaderType(val)
  }
  const handleStomTypeSelected = (val)=>{
    setStormType(val)
  }
  const onTailChanged = (e)=>{
    setTail(e.target.value)
  }
  return(
    <div>
      <h1 color="black">Ввод штормов открытым текстом</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th width="300px">Тип сообщения</th>
            <th width="300px">Вид данных</th>
            <th >Метеостанция</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Select value={stormType} onChange={handleStomTypeSelected} options={stormTypes} /></td>
            <td><Select value={headerType} onChange={handleHeaderSelected} options={headerTypes} /></td>  
            <td><Select value={station} onChange={handleStationSelected} options={stations} /></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p>
          <b>{telegram}</b>
          <input type="text" value={tail} onChange={onTailChanged}/>
        </p>
        <button type="button" onClick={saveStormMessage}>Сохранить</button>
      </div>
      <h1 color="black">Последние шторма</h1>
      <LastAgroStorms lastTelegrams={lastTelegrams} stations={stations} />
    </div>
  )
}

$(function () {
  const node = document.getElementById('init-params');
  if(node) {
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const currStationId = JSON.parse(node.getAttribute('currStationId'))
    // const stormType = JSON.parse(node.getAttribute('stormType'))
        
    ReactDOM.render(
      <InputStormRf telegrams={telegrams} stations={stations} currStationId={currStationId} />, // stormType={stormType}/>,
      document.getElementById('root')
    );
  }
});