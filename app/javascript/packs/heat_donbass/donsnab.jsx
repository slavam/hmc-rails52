import React from 'react';
import ReactDOM from 'react-dom';
import DonsnabForm from './donsnab_form';

const WorkShiftAvgTemperatures = ({temperatures, maxDay, year, month, playdays}) => {
  var currDate = new Date(+year, +month-1, 1);
  // 0=Sunday
  let rows = [];
  let row = [<td key="0"><b>Числа месяца</b></td>];
  for(var i=1; i<=maxDay; ++i){
    currDate.setDate(i);
    let color = ((currDate.getDay() == 0) || (currDate.getDay() == 6) || (playdays.includes(i))) ? 'red' : 'black'; //
    row.push(<td key={i} style={{color: color}}><b>{i}</b></td>);
  }
  rows[0] = <tr key="0">{row}</tr>;
  let values = [];
  for(i=1; i<=maxDay; i++){
    currDate.setDate(i);
    if(currDate.getDay() == 0) temperatures[i] = null;
    let val = temperatures[i] == null ? '': temperatures[i];
    values.push(<td key={i}>{val}</td>);
  }
  rows.push(<tr key="1"><td><b>Температура</b></td>{values}</tr>);
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};
export default class Donsnab extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      daysInMonth: n,
      playdays: this.props.playdays
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChiefSelected = this.handleChiefSelected.bind(this);
    this.handleResponsibleSelected = this.handleResponsibleSelected.bind(this);
  }  
  handleChiefSelected(val){
    this.setState({chiefR: val});
  }
  handleResponsibleSelected(val){
    this.setState({responsibleR: val});
  }
  handleFormSubmit(year, month){
    this.state.year = year;
    this.state.month = month;
    this.state.daysInMonth = new Date(+year, +month, 0).getDate();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/donsnab?year="+year+"&month="+month
      }).done((data) => {
        this.setState({temperatures: data.temperatures, playdays: data.playdays});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    return(
      <div>
        <DonsnabForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Средняя за рабочую смену (07.00-19.00) температура воздуха (°С) с 01 по {endDate} года в г. Донецк</h4>
        <br/>
        <WorkShiftAvgTemperatures temperatures={this.state.temperatures} maxDay={this.state.daysInMonth} year={this.state.year} month={this.state.month} playdays={this.state.playdays}/>
      </div>
    );
  }
}
$(() => {
  const node = document.getElementById('input_params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const playdays = JSON.parse(node.getAttribute('playdays'));
    
    ReactDOM.render(
      <Donsnab temperatures={temperatures} year={year} month={month} playdays={playdays}/>,
      document.getElementById('form_and_report')
    );
  }
});