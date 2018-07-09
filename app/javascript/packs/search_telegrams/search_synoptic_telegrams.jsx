import React from 'react';
import ReactDOM from 'react-dom';
import SearchParamsForm from './search_params_form';
// import AccountTable from './account_table';
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
    var term = params.term == '99' ? '' : "&term="+params.term;
    var stationCode = params.stationCode == '0' ? '' : "&station_code="+params.stationCode;
    var text = params.text.length > 1 ? "&text="+params.text : '';
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "search_synoptic_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+term+stationCode+text
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
        <SearchParamsForm onTelegramSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} errors={this.state.errors} stations={this.props.stations} tlgText={this.state.tlgText}/>
        <h3>Найденные телеграммы ({this.state.telegrams.length})</h3>
        {/*<FoundTelegrams telegrams={this.state.telegrams}/>*/}
      </div>
    );
  }
}

// document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('turbolinks:load', () => {
  const node = document.getElementById('search_params');
  const telegrams = JSON.parse(node.getAttribute('telegrams'));
  const stations = JSON.parse(node.getAttribute('stations'));
  const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
  const dateTo = JSON.parse(node.getAttribute('dateTo'));

  ReactDOM.render(
    <SearchSynopticTelegrams telegrams={telegrams} stations={stations} dateFrom={dateFrom} dateTo={dateTo}/>,
    document.getElementById('form_and_result')
  );
})