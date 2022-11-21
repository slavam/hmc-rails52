import React from 'react';
import ReactDOM from 'react-dom';
import SearchParamsForm from './search_params_form';
import FoundTelegrams from './found_telegrams';
// import DNRMap from '../map/dnr_map';
export default class SearchSynopticTelegrams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      telegrams: this.props.telegrams,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      tlgTerm: this.props.tlgTerm,
      tlgText: this.props.tlgText,
      tlgType: this.props.tlgType,
      stationId: this.props.stationId,
      stormType: this.props.stormType,
      errors: {}
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.stationCoords = this.stationCoords.bind(this);
  }

  handleFormSubmit(params) {
    this.state.dateFrom = params.dateFrom;
    this.state.dateTo = params.dateTo;
    this.state.tlgText = params.text;
    this.state.stationId = params.stationId;
    var that = this;
    let url = '';
    let stationId = params.stationId == '0' ? '' : "&station_id="+params.stationId;
    let text = (!params.text.null && params.text.length > 1) ? "&text="+params.text : '';
    switch(this.props.tlgType) {
      case 'synoptic':
        this.state.tlgTerm = params.term;
        let term = params.term == '99' ? '' : "&term="+params.term;
        url = "search_synoptic_telegrams?date_from="+params.dateFrom+"&date_to="+params.dateTo+term+stationId+text;
        break;
      case 'storm':
        let type = params.stormType == '99' ? '' : "&storm_type="+params.stormType;
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

  stationCoords(){
    let retHash = {};
    this.props.stations.map(s => {
      retHash[s.code] = {lat: +s.latitude, lng: +s.longitude};
    });
    return retHash;
  }
  render(){
    let fact = {
      11: "Ветер",
      12: "Сильный ветер",
      17: "Шквал",
      18: "Шквал",
      19: "Смерч",
      30: "Низкая облачность",
      40: "Видимость",
      50: "Гололед",
      51: "Сложные отложения",
      52: "Налипание мокрого снега",
      61: "Сильный дождь",
      65: "Очень сильный дождь",
      71: "Сильный снег",
      90: "Град",
      91: "Гроза"
    };
    let map;
    if(this.state.tlgType == 'storm'){
      // let markerCoords = {};
      // wating card data
      // map = <DNRMap fact={fact} telegrams={this.state.telegrams} stations={this.props.stations} markerCoords={this.stationCoords()}/>;
    }
    return (
      <div>
        <h3>Параметры поиска</h3>
        <SearchParamsForm onTelegramSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} errors={this.state.errors} stations={this.props.stations} tlgText={this.state.tlgText} tlgType={this.props.tlgType} tlgTerm={this.state.tlgTerm}  stationId={this.state.stationId} stormType={this.state.stormType}/>
        <div id='map'>
          {/* {map} */}
        </div>
        <h3>Найденные телеграммы ({this.state.telegrams.length})</h3>
        <FoundTelegrams fact={fact} telegrams={this.state.telegrams} tlgType={this.props.tlgType} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} tlgTerm={this.state.tlgTerm} tlgText={this.state.tlgText} stationId={this.state.stationId}/>
      </div>
    );
  }
}

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
    const stormType = JSON.parse(node.getAttribute('stormType'));
    const stationId = JSON.parse(node.getAttribute('stationId'));

    ReactDOM.render(
      <SearchSynopticTelegrams telegrams={telegrams} stations={stations} dateFrom={dateFrom} dateTo={dateTo} tlgType={tlgType} tlgTerm={tlgTerm} tlgText={tlgText} stationId={stationId} stormType={stormType} />,
      document.getElementById('form_and_result')
    );
  }
})
