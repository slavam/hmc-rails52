/*jshint esversion: 6 */
import React from 'react';
import ReactDOM from 'react-dom';
// import FireMap from '../map/fire_map';
import ReportDateForm from './report_date_form';

const FireDangersTable = ({fireDangers, stations}) => {
  var rows = [];
  if(fireDangers)
    fireDangers.forEach((fd) => {
      var fireClass = 1;
      if(fd.fire_danger < 401)
        fireClass = 1;
      else if(fd.fire_danger < 1001)
        fireClass = 2;
      else if(fd.fire_danger < 3001)
        fireClass = 3;
      else if(fd.fire_danger < 5001)
        fireClass = 4;
      else
        fireClass = 5;
      let dailyPrecipitation = Math.round((parseFloat(fd.precipitation_day)+parseFloat(fd.precipitation_night))*10)/10;
      rows.push(
        <tr key = {fd.id}>
          <td>{stations[fd.station_id-1].name}</td>
          <td>{fireClass}</td>
          <td>{fd.fire_danger}</td>
          <td>{parseInt(fd.temperature)}</td>
          <td>{parseInt(fd.temperature_dew_point)}</td>
          <td>{dailyPrecipitation}</td>
        </tr>
      );
    });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Метеостанция</th>
          <th>Класс</th>
          <th>Пожароопасность</th>
          <th>Температура (°С)</th>
          <th>Точка росы (°С)</th>
          <th>Осадки за сутки (мм)</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class DailyFireDanger extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fireDangers: this.props.fireDangers,
      reportDate: this.props.reportDate
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(date){
    this.state.reportDate = date;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'daily_fire_danger?report_date='+date
      }).done(function(data) {
        this.setState({fireDangers: data.fireDangers});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка выборки из базы"]});
      }.bind(this));
  }

  render(){
    // let map = <FireMap stations={this.props.stations} fireDangers={this.state.fireDangers}/>;
    return (
      <div>
        <div>
          {/* {map} */}
        </div>
        {/* <h6>0-400 зеленый; 401-1000 синий; 1001-3000 желтый; 3001-5000 оранжевый; более 5000 красный.</h6> */}
        <ReportDateForm onDateSubmit={this.handleSubmit} reportDate={this.state.reportDate} />
        <h3>Показатели пожарной опасности на {this.state.reportDate}</h3>
        <FireDangersTable fireDangers={this.state.fireDangers} stations={this.props.stations}/>
      </div>
    );

  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node){
    const reportDate = JSON.parse(node.getAttribute('reportDate'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const fireDangers = JSON.parse(node.getAttribute('fireDangers'));

    ReactDOM.render(
      <DailyFireDanger fireDangers={fireDangers} stations={stations} reportDate={reportDate}  />,
      document.getElementById('form_and_result')
    );
  }
})
