import React from 'react';
import ReactDOM from 'react-dom';
import SearchParamsForm from './search_params_form';
import FoundTelegrams from './found_telegrams';
export default class SearchSynopticTelegrams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      telegrams: this.props.telegrams,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      tlgTerm: this.props.tlgTerm,
      tlgText: this.props.tlgText,
      stationId: this.props.stationId,
      errors: {}
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(params) {
    this.state.dateFrom = params.dateFrom;
    this.state.dateTo = params.dateTo;
    this.state.tlgText = params.text;
    this.state.stationId = params.stationId;
    var that = this;
    let url = '';
    let stationId = params.stationId == '0' ? '' : "&station_id="+params.stationId;
    let text = params.text.length > 1 ? "&text="+params.text : '';
    switch(this.props.tlgType) {
      case 'synoptic':
        this.state.tlgTerm = params.term;
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
        <SearchParamsForm onTelegramSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} errors={this.state.errors} stations={this.props.stations} tlgText={this.state.tlgText} tlgType={this.props.tlgType} tlgTerm={this.state.tlgTerm}  tlgText={this.state.tlgText} stationId={this.state.stationId}/>
        <h3>Найденные телеграммы ({this.state.telegrams.length})</h3>
        <FoundTelegrams telegrams={this.state.telegrams} tlgType={this.props.tlgType} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} tlgTerm={this.state.tlgTerm} tlgText={this.state.tlgText} stationId={this.state.stationId}/>
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
    const tlgTerm = JSON.parse(node.getAttribute('tlgTerm'));
    const tlgText = JSON.parse(node.getAttribute('tlgText'));
    const stationId = JSON.parse(node.getAttribute('stationId'));
  
    ReactDOM.render(
      <SearchSynopticTelegrams telegrams={telegrams} stations={stations} dateFrom={dateFrom} dateTo={dateTo} tlgType={tlgType} tlgTerm={tlgTerm} tlgText={tlgText} stationId={stationId}/>,
      document.getElementById('form_and_result')
    );
  } 
})