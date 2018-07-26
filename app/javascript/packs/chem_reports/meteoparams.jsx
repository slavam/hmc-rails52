import React from 'react';
import ReactDOM from 'react-dom';
import MeteoparamsForm from './meteoparams_form';

const ParamsRow = ({params}) => {
  // let pressure = params.pressure_at_station_level == null ? <td></td> : <td>{params.pressure_at_station_level}/{(params.pressure_at_station_level/1.334).toFixed()}</td>;
  return (
    <tr key = {params.id}>
      <td width="100px">{params.date}</td>
      <td>{params.term}</td>
      <td>{params.temperature}</td>
      <td>{params.wind_direction}</td>
      <td>{params.wind_speed_avg}</td>
      <td>{params.weather}</td>
      <td>{params.pressure}</td>
    </tr>
  );
};  
const MeteoParamsTable = ({meteoParams}) => {
  var rows = [];
  meteoParams.forEach((p) => {
    rows.push(<ParamsRow params={p} key={p.id} />);
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Срок</th>
          <th>Температура, °С</th>
          <th>Направление ветра, °</th>
          <th>Скорость ветра, м/с</th>
          <th>Атмосферные явления</th>
          <th>Атмосферное давление, hPa/мм.рт.ст.</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};


export default class Meteoparams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      meteoParams: this.props.meteoParams,
      year: this.props.year,
      month: this.props.month,
      stationId: 1,
      stationName: ''
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(data){
    this.state.year = data.year;
    this.state.month = data.month;
    this.state.stationName = data.stationName;
    this.state.stationId = data.stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/get_meteoparams?year="+data.year+"&month="+data.month+"&station_id="+data.stationId
      }).done((data) => {
        this.setState({meteoParams: data});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }

  render(){
    let desiredLink = "/synoptic_observations/get_meteoparams.pdf?year="+this.state.year+"&month="+this.state.month+"&station_id="+this.state.stationId;
    let table = this.state.meteoParams.length > 0 ?
      <div>
        <p>Год: {this.state.year}. Месяц: {this.state.month}. Метеостанция: {this.state.stationName}</p>
        <MeteoParamsTable meteoParams={this.state.meteoParams} />
        <p>Число замеров: {this.state.meteoParams.length}</p>
        <a href={desiredLink}>Распечатать</a>
      </div> : '';
    return(
      <div>
        <h1>Таблица наблюдений за метеопараметрами</h1>
        <h3>Задайте год, месяц и метеостанцию</h3>
        <MeteoparamsForm year={this.state.year} month={this.state.month} stations={this.props.stations} onFormSubmit={this.handleFormSubmit} stationId={this.state.stationId}/>
        {table}
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('input_params');
  if(node){
    const meteoParams = JSON.parse(node.getAttribute('meteoparams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    
    ReactDOM.render(
      <Meteoparams meteoParams={meteoParams} stations={stations} year={year} month={month} />,
      document.getElementById('form_and_report')
    );
  }
})