import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const ResultTableCSDN = ({csdnTemp, maxDay}) => {
  let rows = [];
  let row = [<td key="00"><b>Метеостанции</b></td>];
  for(var i=1; i<=maxDay; ++i){
    row.push(<td key={i}><b>{i}</b></td>);
  }
  rows[0] = <tr key="000">{row}</tr>;
  let cities = [
    <td><b>Донецк<br/></b></td>,
    <td><b>Дебальцево</b></td>,
    <td><b>Амвросиевка<br/></b></td>,
    <td><b>Волноваха</b></td>,
    <td><b>Мариуполь</b></td>,
    <td><b>Седово</b></td>
  ];
  let values = [];
  for(let j=0; j<6; ++j){
    values = [];
    for(var i=1; i<=maxDay; ++i){
      let key = ('0'+i).slice(-2)+'-'+('0'+j).slice(-2);
      let val = csdnTemp[j][i] == null ? '': csdnTemp[j][i];
      values.push(<td key={i}>{val}</td>);
    }
    rows.push(<tr key={j}>{cities[j]}{values}</tr>);
  };
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
}

export default class Teploenergo5CSDN extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      csdnTemp: this.props.csdnTemp,
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
      url: "/synoptic_observations/teploenergo5_csdn?year="+year+"&month="+month
      }).done((data) => {
        this.setState({csdnTemp: data.csdnTemp});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let desiredLink = "/synoptic_observations/teploenergo5_csdn.pdf?year="+this.state.year+"&month="+this.state.month;
    return(
      <div>
        <MonthYearForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h5>Средняя за сутки (00:01-24:00) температура воздуха (°С) с 01 по {endDate} года на метеостанциях Донецкой Народной Республики (ЦСДН)</h5>
        
        <ResultTableCSDN csdnTemp={this.state.csdnTemp} maxDay={this.state.daysInMonth}/>
        <a href={desiredLink+'&variant=chief'} title='Подписал начальник'>Распечатать</a>
        <br/>
        <a href={desiredLink+'&variant=deputy_chief'} title='Подписал заместитель'>Распечатать</a>
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const csdnTemp = JSON.parse(node.getAttribute('csdn_temp'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    
    ReactDOM.render(
      <Teploenergo5CSDN csdnTemp={csdnTemp} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});