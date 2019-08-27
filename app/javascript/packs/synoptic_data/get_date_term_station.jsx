import React from 'react';
import ReactDOM from 'react-dom';
import DtsForm from './dts_form';

export default class DateTermStation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observationId: null,
    };
    this.handleDTSSubmit = this.handleDTSSubmit.bind(this);
  }
  handleDTSSubmit(date, term, stationId){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/test_telegram?observation_date="+date+"&term="+term+"&station_id="+stationId
      }).done((data) => {
        this.setState({observationId: data.observation_id});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  render(){
    let editLink = "/synoptic_observations/"+this.state.observationId+"/edit_synoptic_data";
    let createLink = "/synoptic_observations/new_synoptic_data";
    let link = this.state.observationId != null ? (this.state.observationId>0 ? <a href={editLink}>Изменить</a> : <a href={createLink}>Создать</a>) : '';
    return(
      <div>
        <DtsForm onFormSubmit={this.handleDTSSubmit} observationDate={this.props.observationDate} stations={this.props.stations}/>
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