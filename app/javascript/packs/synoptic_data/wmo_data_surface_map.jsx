import React from 'react';
import ReactDOM from 'react-dom';
import DateTermForm from './date_term_form';
import WmoSurfaceMap from '../map/wmo_surface_map';

export default class WmoDataSurfaceMap extends React.Component{
  constructor(props){
    super(props);
    this.state={
      telegrams: this.props.telegrams,
      term: this.props.term,
      setStations: 'set2500', //this.props.setStations,
      observationDate: this.props.observationDate
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(date,term,setStations){
    this.state.observationDate = date;
    this.state.term = +term<10? '0'+term : term;
    this.state.setStations = setStations;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'surface_map_show?date='+date+'&term='+this.state.term+'&set_stations='+this.state.setStations
      }).done(function(data) {
        this.setState({telegrams: data.telegrams});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка выборки из базы"]});
      }.bind(this)); 
  }
  
  render(){
    return(
      <div>
        <DateTermForm term={this.state.term} observationDate={this.state.observationDate} onDateTermSubmit={this.handleSubmit}/>
        <h3>Данные на приземной карте за {this.state.observationDate} срок {this.state.term}</h3>
        <WmoSurfaceMap telegrams={this.state.telegrams} setStations={this.state.setStations}/>
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
    
    ReactDOM.render(
      <WmoDataSurfaceMap telegrams={telegrams} term={term} observationDate={observationDate} />,
      document.getElementById('form_surface_map')
    );
  } 
})