import React from 'react';
import ReactDOM from 'react-dom';
import NewOtherData from './new_other_data';

const LastData = ({observations, tlgType, stations, onClickDelete}) => {
  var rows = [];
  observations.forEach((o) => {
    if (tlgType == 'perc')
      rows.push(<tr key={o.id}><td>{o.obs_date}</td><td>{o.source}</td><td>{o.period}</td><td>{o.value}</td><td>{o.description}</td><td><button id={o.id} onClick={o => onClickDelete(o)}>Удалить</button></td></tr>);
    else if (tlgType == 'wind')
      rows.push(<tr key={o.id}><td>{o.obs_date}</td><td>{o.period+':00'}</td><td>{stations[o.station_id]}</td><td>{parseInt(o.value,10)}</td><td><button id={o.id} onClick={o => onClickDelete(o)}>Удалить</button></td></tr>);
    else
      rows.push(<tr key={o.id}><td>{o.obs_date}</td><td>{stations[o.station_id]}</td><td>{o.value}</td><td><button id={o.id} onClick={o => onClickDelete(o)}>Удалить</button></td></tr>);
  });
  let hdr = '';
  if (tlgType == 'perc')
    hdr = <tr>
          <th width = "200px">Дата наблюдения</th>
          <th>Пост</th>
          <th>Период</th>
          <th>Значение</th>
          <th>Описание</th>
          <th>Действия</th>
        </tr>;
  else if(tlgType == 'wind')
    hdr = <tr>
      <th width = "200px">Дата наблюдения</th>
      <th>Время</th>
      <th>Метеостанция</th>
      <th>Значение</th>
      <th>Действия</th>
    </tr>;
  else
    hdr = <tr>
          <th width = "200px">Дата наблюдения</th>
          <th>Метеостанция</th>
          <th>Значение</th>
          <th>Действия</th>
        </tr>;
  return (
    <table className="table table-hover">
      <thead>
        {hdr}
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class InputOtherData extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currDate: this.props.currDate,
      tlgType: this.props.tlgType,
      inputMode: this.props.inputMode,
      observations: this.props.observations
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDataTypeChanged = this.handleDataTypeChanged.bind(this);
    this.deleteOtherData = this.deleteOtherData.bind(this);
  }
  handleFormSubmit(other_observation){
    this.state = {currDate: other_observation.obs_date, tlgType: other_observation.data_type};
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: other_observation, 
      url: "/other_observations/create_other_data"
      }).done((data) => {
        this.setState({observations: data.observations}); //, tlgType: 'temp'}); //, tlgType: data.tlgType, currDate: data.currDate, inputMode: data.inputMode, errors: data.errors});
        alert(data.errors[0]);
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  handleDataTypeChanged(tlgType){
    var desiredLink = "/other_observations/get_last_telegrams?data_type="+tlgType;
    this.state.tlgType = tlgType;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: desiredLink
    }).done((data) => {
      this.setState({observations: data.observations, errors: []});
    }).fail((res) => {
      this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  deleteOtherData(event){
    $.ajax({
      type: 'DELETE',
      url: "/other_observations/delete_other_data/"+event.target.id
    }).done(function(data){
      this.setState({observations: data.observations});
      alert(data.errors[0]);
    }.bind(this))
    .fail(function(res){ // RecordNotFound
      let id = this.state.observations.findIndex((element, index, array) => element.id == event.target.id);
      if(id > -1){
        let observations = [...this.state.observations];
        observations.splice(id, 1);
        this.setState( {observations: observations} );
      }
    }.bind(this));
  }
  render(){
    let stationName = '';
    if(this.props.stationId!=''){
      let ss = [null, "Донецк", "Амвросиевка", "Дебальцево","Волноваха","Мариуполь",,,,,"Седово"]
      stationName = ss[+this.props.stationId]
    }
    return(
      <div>
        <h3>Ввод дополнительных данных</h3>
        <NewOtherData stationId={this.props.stationId} stationName={stationName} tlgType={this.state.tlgType} currDate={this.state.currDate} inputMode={this.state.inputMode} onFormSubmit={this.handleFormSubmit} onDataTypeChange={this.handleDataTypeChanged} otherTypes={this.props.otherTypes} stations={this.props.stations} localTime={this.props.localTime} />
        <h3>{this.props.otherTypes[this.state.tlgType]}</h3>
        <LastData observations={this.state.observations} tlgType={this.state.tlgType} stations={this.props.stations} onClickDelete={this.deleteOtherData} />
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node) {
    const observations = JSON.parse(node.getAttribute('observations'));
    const currDate = JSON.parse(node.getAttribute('currDate'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const inputMode = JSON.parse(node.getAttribute('inputMode'));
    const otherTypes = JSON.parse(node.getAttribute('otherTypes'));
    const localTime = JSON.parse(node.getAttribute('localTime'));
    const stationId = JSON.parse(node.getAttribute('stationId'));
    ReactDOM.render(
      <InputOtherData stationId={stationId} observations={observations} stations={stations} currDate={currDate} tlgType={tlgType} inputMode={inputMode} otherTypes={otherTypes} localTime={localTime}/>,
      document.getElementById('form_and_last_telegrams')
    );
  }
});