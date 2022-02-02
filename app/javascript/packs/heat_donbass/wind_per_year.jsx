import React from 'react';
import ReactDOM from 'react-dom';
import StationYearForm from './station_year_form';

const WindByRhumb = ({wind}) => {
  let rows = [];
  const MONTHS = ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  for(let m=1; m<=12; m++){
    let values = [];
    for(let i=1; i<12; i++){
      let val = wind[m] ? wind[m][i]+' '+(wind[m][i]>0 && (i<9 || i==10)? '/'+Math.round(wind[m][i]*1000/(i==10? wind[m][11]:wind[m][9]))/10:'') : '';
      values.push(<td key={i}>{val}</td>);
    }
    rows.push(<tr key={m}><td key="0"><b>{MONTHS[m]}</b></td>{values}</tr>)
  }  
  return <table className="table table-hover">
    <thead>
      <tr>
        <th>Месяц</th>
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
  </table>;
};
export default class WindPerYear extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stationId: this.props.stationId,
      year: this.props.year,
      wind: this.props.wind
    }
  }
  handleFormSubmit= (stationId, year) =>{
    this.state.year = year;
    this.state.stationId = stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/wind_per_year?year="+year+"&station_id="+stationId
      }).done((data) => {
        this.setState({wind: data.wind});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const stationName = this.props.stations.find(s => s.id == this.state.stationId).name;
    let desiredLink = "/synoptic_observations/wind_per_year.pdf?year="+this.state.year+"&station_id="+this.state.stationId;
    return(
      <div className='container'>
        <h4>Задайте год и станцию</h4>
        <StationYearForm stations={this.props.stations} year={this.state.year} onParamsSubmit={this.handleFormSubmit} />
        <h4>Распределение ветра по направлениям на станции {stationName} за {this.state.year} год</h4>
        <WindByRhumb wind={this.state.wind} />
        <a href={desiredLink}>Распечатать</a>
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const wind = JSON.parse(node.getAttribute('wind'));
    const year = JSON.parse(node.getAttribute('year'));
    const stationId = JSON.parse(node.getAttribute('stationId'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <WindPerYear wind={wind} year={year} stationId={stationId} stations={stations} />,
      document.getElementById('root')
    );
  }
});