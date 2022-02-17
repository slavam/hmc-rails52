import React from 'react';
import ReactDOM from 'react-dom';
import WindSearchForm from './wind_search_form';
import WindMonthlyForm from './wind_monthly_form';

const stations = ['','Донецк','Амвросиевка','Дебальцево','','','','','','','Седово'];
const MONTHS = ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const stationsArray = [];
stations.map((s,i) => {return (s !== '') ? stationsArray.push({label: s, value: i}) : null});
export default class WindMonthly extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stationId: this.props.stationId,
      year: this.props.year,
      month: this.props.month,
      wind: this.props.wind
    }
  }
  handleSearchSubmit= (stationId, year, month) =>{
    this.state.year = year;
    this.state.month = month;
    this.state.stationId = stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/other_observations/wind_monthly_data?year=${year}&month=${month}&station_id=${stationId}`
      }).done((data) => {
        this.setState({wind: data.wind});
      }).fail((res) => {
        alert("Проблемы с чтением данных из БД")
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  handleWindSubmit = (wind) => {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {wind: wind, year: this.state.year, month: this.state.month, station_id: this.state.stationId}, 
      url: "/other_observations/create_wind_data"
      }).done((data) => {
        this.setState({wind: wind}); 
        alert(data.message);
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  render(){
    const stationName = stations[this.state.stationId];
    let rows = [0,0,0,0,0,0,0,0,0,0,0];
    const daysInMonth = new Date(+this.state.year, +this.state.month, 0).getDate();
    if(this.state.wind)
      for(let j=1; j<=daysInMonth; j++){
        for(let i=0; i<8; i++){
          let val = this.state.wind[j] ? (this.state.wind[j][i]>'' ? this.state.wind[j][i] : null) : null;
          rows[10] += 1  // total
          if(val == 0){
            rows[9] += 1; // calm
          } else {
            rows[8] += 1;
            switch (val){
              case val < 23 :
                rows[0] += 1;
                break;
              case (val < 68) :
                rows[1] += 1;
                break;
              case val < 113 :
                rows[2] += 1;
                break;
              case val < 158 :
                rows[3] += 1;
                break;
              case val < 203 :
                rows[4] += 1;
                break;
              case val < 248 :
                rows[5] += 1;
                break;
              case val < 293 :
                rows[6] += 1;
                break;
              case val < 338 :
                rows[7] += 1;
                break;
              default :
                rows[0] += 1;
            }
          }
        }
      }
    rows = <tr><td>{rows[0]}</td><td>{rows[1]}</td><td>{rows[2]}</td><td>{rows[3]}</td><td>{rows[4]}</td><td>{rows[5]}</td><td>{rows[6]}</td><td>{rows[7]}</td><td>{rows[8]}</td><td>{rows[9]}</td><td>{rows[10]}</td></tr>
    return(
      <div className='container'>
        <h4>Задайте год, месяц и станцию</h4>
        <WindSearchForm stations={stationsArray} month={this.state.month} year={this.state.year} onSearchSubmit={this.handleSearchSubmit} />
        
        {/*<WindByRhumb wind={this.state.wind} />*/}
        <h4>Распределение ветра по направлениям на станции {stationName} за {MONTHS[this.state.month]} {this.state.year} года</h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>С</th>
              <th>СВ</th>
              <th>В</th>
              <th>ЮВ</th>
              <th>Ю</th>
              <th>ЮЗ</th>
              <th>З</th>
              <th>СЗ</th>
              <th>С ветром</th>
              <th>Штиль</th>
              <th>Всего</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <WindMonthlyForm wind={this.state.wind} numDays={daysInMonth} onWindSubmit={this.handleWindSubmit}/>
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const wind = JSON.parse(node.getAttribute('wind'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const stationId = JSON.parse(node.getAttribute('stationId'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <WindMonthly wind={wind} year={year} month={month} stationId={stationId} stations={stations} />,
      document.getElementById('root')
    );
  }
});