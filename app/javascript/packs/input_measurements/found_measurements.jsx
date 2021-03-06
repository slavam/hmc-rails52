/*jshint esversion: 6 */
import React from 'react';

export default class FoundMeasurements extends React.Component{
  handleDeleteMeasurementClick(e){
    e.preventDefault();
    if (!confirm("Удалить?"))
      return;
    this.props.onDeleteMeasurement(e.target.id);
  }
  handleDeletePollutionClick(e){
    var measurementId;
    e.preventDefault();
    if (!confirm("Удалить?"))
      return;
    let i = document.getElementById(e.target.id);
    if(i){
      measurementId = i.getAttribute('data-measurementid');
    }
    this.props.onDeletePollution(measurementId, e.target.id);
  }
  render(){
    const materials = [];
    this.props.materials.forEach(mt => {
      materials[mt.id] = mt.name;
    });
    const posts = [];
    this.props.posts.forEach( p => {
      posts[p.id] = p.name;
    });
    let rows = [];
    this.props.measurements.forEach( m => {
      rows.push(<tr key={m.measurement.id} style={{background: '#ccc'}}>
          <td >{posts[+m.measurement.post_id]}</td>
          <td >Дата: {m.measurement.date}</td>
          <td >Срок: {m.measurement.term}</td>
          <td><input id={m.measurement.id} type="submit" value="Удалить" onClick={(event) => this.handleDeleteMeasurementClick(event)}/></td>
        </tr>);
      if(m.pollutions.length>0){
        let pollutions = [];
        m.pollutions.forEach(p => {
          pollutions.push(<tr key={p.id}>
            <td>{materials[+p.material_id]}</td>
            <td>{p.value}</td>
            <td>{p.concentration}</td>
            <td><input id={p.id} data-measurementid={m.measurement.id} type="submit" value="Удалить" onClick={(event) => this.handleDeletePollutionClick(event)}/></td>
          </tr>);
        });
        rows.push(<tr key={100000+m.measurement.id}>
          <td colSpan='4'>
            <table className='table table-bordered'>
              <thead className='thead-dark'>
                <tr style={{background: '#aaa'}}>
                  <th>Вещество</th>
                  <th>Плотность</th>
                  <th>Концентрация</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {pollutions}
              </tbody>
            </table>
          </td>
        </tr>);
      }
    });
    return(
      <div>
        <h3>Найденные измерения ({this.props.measurements.length})</h3>
        <table className='table table-striped'>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
