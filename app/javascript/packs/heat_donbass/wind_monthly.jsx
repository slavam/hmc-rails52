import React from 'react';
import ReactDOM from 'react-dom';
import WindSearchForm from './wind_search_form';

const MONTHS = ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const monthsArray = [];
MONTHS.map((m,i) => {return monthsArray.push({label: m, value: i})});
const stations = ['','Донецк','Амвросиевка','Дебальцево','','','','','','','Седово'];
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
  handleWindSubmit = (e) => {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {wind: this.state.wind, year: this.state.year, month: this.state.month, station_id: this.state.stationId}, 
      url: "/other_observations/create_wind_data"
      }).done((data) => {
        this.setState({errors: ''});
        alert(data.message);
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  handleWindChange = (e) => {
    const i = parseInt(e.target.id / 8);
    const j = e.target.id % 8;
    this.state.wind[i][j] = e.target.value;
    this.setState({wind: this.state.wind})
  }
  render(){
    const stationName = stations[this.state.stationId];
    let rows = [0,0,0,0,0,0,0,0,0,0,0];
    const daysInMonth = new Date(+this.state.year, +this.state.month, 0).getDate();
    if(this.state.wind)
      for(let j=0; j<daysInMonth; j++){
        for(let i=0; i<8; i++){
          let val = this.state.wind[j][i]===null ? null : +this.state.wind[j][i];
          if (val!==null){
            rows[10] += 1  // total
            if(val == 0){
              rows[9] += 1; // calm
            } else {
              rows[8] += 1;
              if(val < 23)
                rows[0] += 1;
              else if (val < 68)
                rows[1] += 1;
              else if (val < 113)
                rows[2] += 1;
              else if(val < 158)
                  rows[3] += 1;
              else if(val < 203)
                rows[4] += 1;
              else if (val < 248)
                rows[5] += 1;
              else if (val < 293)
                rows[6] += 1;
              else if (val < 338)
                rows[7] += 1;
              else
                rows[0] += 1;
            }
          }
        }
      }
    let rowNum = <tr><td>Количество</td><td>{rows[0]}</td><td>{rows[1]}</td><td>{rows[2]}</td><td>{rows[3]}</td><td>{rows[4]}</td><td>{rows[5]}</td><td>{rows[6]}</td><td>{rows[7]}</td><td>{rows[8]}</td><td>{rows[9]}</td><td>{rows[10]}</td></tr>
    let pRhumb = [];
    if(rows[8]!=0){
      for(let m=0; m<8; m++){
        pRhumb.push(<td key={m}>{rows[m]!=0 ? (rows[m]*100/rows[8]).toFixed(2) : ''}</td>);
      }
    }
    let pCalm = rows[9]!=0 && rows[10]!=0 ? (rows[9]*100/rows[10]).toFixed(2) : '';
    let rowPerc = <tr><td>Проценты</td>{pRhumb}<td></td><td>{pCalm}</td><td></td></tr>
    
    let rowsWind = [];
    for (let k=0; k<daysInMonth; k++){
      let row = [];
      for (let l=0; l<8; l++){
        let v = this.state.wind[k][l]===null ? '' : this.state.wind[k][l];
        row.push(<td key={k*8+l}><input key={k*8+l} id={k*8+l} value={v} type='number' min='0' max='360' onChange={(event) => this.handleWindChange(event)} required/></td>)
      }
      rowsWind.push(<tr key={k}><td>{k+1}</td>{row}</tr>)
    }
    return(
      <div className='container'>
        <h4>Задайте параметры</h4>
        <WindSearchForm stations={stationsArray} months={monthsArray} onSearchSubmit={this.handleSearchSubmit} />
        
        <h4>Распределение ветра по направлениям на станции {stationName} за {MONTHS[this.state.month]} {this.state.year} года</h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th></th>
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
          <tbody>
            {rowNum}
            {rowPerc}
          </tbody>
        </table>

        <h4>Введите данные на станции {stationName} за {MONTHS[this.state.month]} {this.state.year} года</h4>
        <form className="windForm" onSubmit={(event) => this.handleWindSubmit(event)}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Число</th>
                <th>00</th>
                <th>03</th>
                <th>06</th>
                <th>09</th>
                <th>12</th>
                <th>15</th>
                <th>18</th>
                <th>21</th>
              </tr>
            </thead>
            <tbody>
              {rowsWind}
            </tbody>
          </table>
          <input type="submit" value="Сохранить" />
        </form>
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