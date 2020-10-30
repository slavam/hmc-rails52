/*jshint esversion: 6 */
import React from 'react';
import ReactDOM from 'react-dom';
import ParamsForm from './params_form';

function fancyTimeFormat(duration)
{
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
const Storms = (props) => {
  const fact = {
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
  var rows = [];

  props.telegrams.forEach( (t,i) => {
    let startDate = t.start_date ? t.start_date.substr(0,16).replace(/T/, " "):'';
    let stopDate = t.stop_date ? t.stop_date.substr(0,16).replace(/T/, " "):'';
    // let duration = (t.start_date && t.stop_date) ? Math.floor((Date.parse(t.stop_date) - Date.parse(t.start_date)) / (1000*60)): '';
    let duration = (t.start_date && t.stop_date) ? fancyTimeFormat((Date.parse(t.stop_date) - Date.parse(t.start_date))/1000) : '';

    rows.push(<tr key={i}><td>{props.stations[+t.station_id].name}</td><td>{fact[+t.warep_code]}</td><td>{startDate}</td><td>{t.start_text}</td><td>{stopDate}</td><td>{t.stop_text}</td><td>{duration}</td></tr>);
  });
  return (
    <table className="table table-hover" width="100%">
      <thead>
        <tr>
          <th>Метеостанция</th>
          <th>Явление</th>
          <th>Время начала UTC</th>
          <th>Телеграмма</th>
          <th>Время окончания UTC</th>
          <th>Телеграмма</th>
          <th>Продолжительность (часы:минуты:секунды)</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

export default class StormDescription extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      telegrams: this.props.telegrams,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleFormSubmit(params) {
    this.state.dateFrom = params.dateFrom;
    this.state.dateTo = params.dateTo;
    this.state.stationId = params.stationId;
    let url = '';
    let stationId = params.stationId == '0' ? '' : "&station_id="+params.stationId;
    url = "storm_description?date_from="+params.dateFrom+"&date_to="+params.dateTo+stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url
      }).done(function(data) {
        // alert(data.telegrams.length)
        this.setState({telegrams: data.telegrams, errors: {}});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка записи в базу"]});
      }.bind(this));
  }
  render(){
    // let map;
    // map = <DNRMap fact={fact} telegrams={this.state.telegrams} stations={this.props.stations} markerCoords={this.stationCoords()}/>;
    return (
      <div>
        <h3>Параметры поиска</h3>
        <ParamsForm onParamsSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} stations={this.props.stations} />
        <h3>Описание штормов</h3>
        <Storms telegrams={this.state.telegrams} stations={this.props.stations} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} stationId={this.state.stationId}/>
      </div>
    );
  }

}

// document.addEventListener('turbolinks:load', () => {
$(function () {
  const node = document.getElementById('init-params');
  if(node){
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));

    ReactDOM.render(<StormDescription telegrams={telegrams} stations={stations} dateFrom={dateFrom} dateTo={dateTo}/>,
      document.getElementById('root')
    );
  }
});
