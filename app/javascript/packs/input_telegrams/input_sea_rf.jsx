import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import { checkSeaRf } from './check_sea_rf';

export const InputSeaRf=({telegrams})=>{
  const stations = [
    {label: "Мариуполь", value: 34712, id: 5},
    {label: "Седово", value: 99023, id: 10}
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
  const [section1, setSection1] = useState('0110 1ddff 2ffVW 3sTTT 4sTTT 5iHHH 59HHH 6PPDD 8ashhh 88shhh 89shhh')
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
  const saveSeaMessage=()=>{
    let error = []
    if(checkSeaRf(section1, error)){
      alert('OK')
    }else{
      alert(error[0])
    }
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
        </table>
        <button type="button" onClick={saveSeaMessage}>Сохранить</button>
      </div>
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