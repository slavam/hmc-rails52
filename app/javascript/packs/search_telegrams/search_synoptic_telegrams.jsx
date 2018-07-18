import React from 'react';
import ReactDOM from 'react-dom';
import SearchParamsForm from './search_params_form';
import FoundTelegrams from './found_telegrams';
export default class SearchSynopticTelegrams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      telegrams: this.props.telegrams,
      errors: {}
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(params) {
    var that = this;
    let url = '';
    let stationId = params.stationId == '0' ? '' : "&station_id="+params.stationId;
    let text = params.text.length > 1 ? "&text="+params.text : '';
    switch(this.props.tlgType) {
      case 'synoptic':
        let term = params.term == '99' ? '' : "&term="+params.term;
        url = "search_synoptic_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+term+stationId+text;
        break;
      case 'storm':
        let type = params.type == '99' ? '' : "&type="+params.type;
        url = "search_storm_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+type+stationId+text;
        break;
      case 'agro':
        url = "search_agro_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+stationId+text;
        break;
      case 'agro_dec':
        url = "search_agro_dec_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+stationId+text;
    }
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url
      }).done(function(data) {
        that.setState({telegrams: data.telegrams, errors: {}});
      }.bind(that))
      .fail(function(res) {
        that.setState({errors: ["Ошибка записи в базу"]});
      }.bind(that)); 
  }
  
  render(){
    return (
      <div>
        <h3>Параметры поиска</h3>
        <SearchParamsForm onTelegramSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} errors={this.state.errors} stations={this.props.stations} tlgText={this.state.tlgText} tlgType={this.props.tlgType}/>
        <h3>Найденные телеграммы ({this.state.telegrams.length})</h3>
        <FoundTelegrams telegrams={this.state.telegrams} tlgType={this.props.tlgType}/>
      </div>
    );
  }
}

// document.addEventListener('DOMContentLoaded', () => {
// document.addEventListener('turbolinks:load', () => {
$(function () {
  const node = document.getElementById('search_params');
  if(node){
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
  
    ReactDOM.render(
      <SearchSynopticTelegrams telegrams={telegrams} stations={stations} dateFrom={dateFrom} dateTo={dateTo} tlgType={tlgType}/>,
      document.getElementById('form_and_result')
    );
  } 
})