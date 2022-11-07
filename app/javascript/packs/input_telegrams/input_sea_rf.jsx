import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import ru from 'date-fns/locale/ru';
// import { checkStormRf } from './check_storm_rf';

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
  const saveSeaMessage=()=>{}
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
        {/* <input type="text" value={section1} onChange={onTailChanged}/> */}
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