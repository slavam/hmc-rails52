import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const ResultTable = ({temperatures, maxDay}) => {
  let rows = [];
  let row = [<td key="0"><b>Населенные пункты ДНР</b></td>];
  for(var i=1; i<=maxDay; ++i){
    row.push(<td key={i}><b>{i}</b></td>);
  }
  rows[0] = <tr key="0">{row}</tr>;
  let cities = [
    ,
    <td><b>Донецк<br/></b></td>,
    <td><b>Макеевка<br/></b></td>,
    <td><b>Горловка</b></td>,
    <td><b>Шахтерск</b></td>,
    <td><b>Старобешево</b></td>,
    <td><b>Новоазовск</b></td>
  ];
  let values = [];
  [1,2,3,4,5,6].forEach((j) => { 
    values = [];
    for(var i=1; i<=maxDay; ++i){
      let val = temperatures[j][i] == null ? '': temperatures[j][i];
      values.push(<td key={i}>{val}</td>);
    }
    rows.push(<tr key={j}>{cities[j]}{values}</tr>);
  });
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};

export default class Temperatures12 extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      daysInMonth: n
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }  
  handleFormSubmit(year, month){
    this.state.year = year;
    this.state.month = month;
    this.state.daysInMonth = new Date(+year, +month, 0).getDate();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/temperatures_12local?year="+year+"&month="+month
      }).done((data) => {
        this.setState({temperatures: data.temperatures});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let desiredLink = "/synoptic_observations/temperatures_12local.pdf?year="+this.state.year+"&month="+this.state.month;
    return(
      <div>
        {/*<Temperatures12Form year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />*/}
        <MonthYearForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h5>Температура воздуха (°С) в 12.00 с 01 по {endDate} года для населенных пунктов Донецкой Народной Республики</h5>
        
        <ResultTable temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>
        <a href={desiredLink+'&variant=chief'} title='Подписал начальник'>Распечатать вариант 1</a>
        <br/>
        <a href={desiredLink+'&variant=deputy_chief'} title='Подписал заместитель'>Распечатать вариант 2</a>
        
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    
    ReactDOM.render(
      <Temperatures12 temperatures={temperatures} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});