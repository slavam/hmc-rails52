import React from 'react';
import ReactDOM from 'react-dom';
import DateTermForm from './date_term_form';
import SurfaceMap from '../map/surface_map';

export default class DataSurfaceMap extends React.Component{
  constructor(props){
    super(props);
    this.state={
      telegrams: this.props.telegrams,
      term: this.props.term,
      observationDate: this.props.observationDate
    };
    this.stationCoords = this.stationCoords.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(date,term){
    this.state.observationDate = date;
    this.state.term = term;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'find_term_telegrams?date='+date+'&term='+term
      }).done(function(data) {
        this.setState({telegrams: data.telegrams});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка выборки из базы"]});
      }.bind(this)); 
  }
  
  stationCoords(){
    let retHash = {};
    this.props.stations.map(s => {
      retHash[s.code] = {lat: +s.latitude, lng: +s.longitude};
    });
    return retHash;
  }
  
  render(){
    return(
      <div>
        <DateTermForm term={this.state.term} observationDate={this.state.observationDate} onDateTermSubmit={this.handleSubmit}/>
        <h3>Данные на приземной карте за {this.state.observationDate} срок {this.state.term}</h3>
        <SurfaceMap telegrams={this.state.telegrams} stations={this.props.stations} markerCoords={this.stationCoords()}/>;
      </div>
    );
  }  
}

$(() => {
  const node = document.getElementById('init_params');
  if(node){
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const term = JSON.parse(node.getAttribute('term'));
    const observationDate = JSON.parse(node.getAttribute('observationDate'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <DataSurfaceMap telegrams={telegrams} term={term} observationDate={observationDate} stations={stations} />,
      document.getElementById('form_surface_map')
    );
  } 
})