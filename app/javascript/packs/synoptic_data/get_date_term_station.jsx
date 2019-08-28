import React from 'react';
import ReactDOM from 'react-dom';
import DtsForm from './dts_form';

export default class DateTermStation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observationDate: this.props.observationDate,
      term: 0,
      stationId: 1,
      observationId: null,
      telegram: ''
    };
    this.handleDTSSubmit = this.handleDTSSubmit.bind(this);
  }
  handleDTSSubmit(date, term, stationId){
    this.state.observationDate = date;
    this.state.term = term;
    this.state.stationId = stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/test_telegram?observation_date="+date+"&term="+term+"&station_id="+stationId
      }).done((data) => {
        this.setState({observationId: data.observation_id, telegram: data.telegram});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  render(){
    let editLink = "/synoptic_observations/"+this.state.observationId+"/edit";
    let createLink = "/synoptic_observations/new?date="+this.state.observationDate+"&term="+this.state.term+"&station_id="+this.state.stationId;
    let link = this.state.observationId != null ? (this.state.observationId>0 ? <a href={editLink}>Изменить?</a> : <a href={createLink}>Создать?</a>) : '';
    let telegram = this.state.observationId>0 ? 
      "Найдена телеграмма: дата: "+this.state.observationDate+"; срок: "+this.state.term+"; метеостанция: "+this.state.stationId+"; текст: "+this.state.telegram+"=" : 
      (this.state.observationId==0 ? "Нет телеграммы: дата: "+this.state.observationDate+"; срок: "+this.state.term+"; метеостанция: "+this.state.stationId+";":'');
    return(
      <div>
        <DtsForm onFormSubmit={this.handleDTSSubmit} observationDate={this.props.observationDate} stations={this.props.stations}/>
        <p>{telegram}</p>
        {link}
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('dts_params');
  if(node){
    const observationDate = JSON.parse(node.getAttribute('observationDate'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <DateTermStation observationDate={observationDate} stations={stations} />,
      document.getElementById('form_dts')
    );
  } 
})