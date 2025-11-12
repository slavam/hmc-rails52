import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import TppForm from './tpp_form';

const WorkShiftAvgTemperatures = ({temperatures, maxDay}) => {
  let rows = [];
  let row = [<td key="0"><b>Числа месяца</b></td>];
  for(var i=1; i<=maxDay; ++i){
    row.push(<td key={i}><b>{i}</b></td>);
  }
  rows[0] = <tr key="0">{row}</tr>;
  let values = [];
  for(i=1; i<=maxDay; i++){
    let val = temperatures[i] == null ? '': temperatures[i];
    values.push(<td key={i}>{val}</td>);
  }
  rows.push(<tr key="1"><td><b>Температура</b></td>{values}</tr>);
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};
export default class Teploenergo extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      chiefR: {value: 'Lukjanenko', label: 'Лукьяненко М.Б.'},
      responsibleR: {value: 'Boyko', label: 'Бойко Л.Н.'},
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      daysInMonth: n
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
      url: "/synoptic_observations/tpp?year="+year+"&month="+month
      }).done((data) => {
        this.setState({temperatures: data.temperatures});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    const chiefs = [
      {value: 'Lukjanenko', label: 'Лукьяненко М.Б.'},
      {value: 'Stec', label: 'Стец Н.В.'},
    ];
    const responsibles = [
      {value: 'Boyko', label: 'Бойко Л.Н.'},
      {value: 'Kijanenko', label: 'Кияненко М.А.'},
    ];
    let desiredLink = "/synoptic_observations/tpp.pdf?year="+this.state.year+"&month="+this.state.month+"&chief="+this.state.chiefR.value+"&responsible="+this.state.responsibleR.value;
    // let lnk = `/synoptic_observations/tpp.pdf?year=${this.state.year}&month=${this.state.month}`
    let ref = `/bulletins/new_bulletin?bulletin_type=inquiry&doc_link=synoptic_observations/tpp.pdf&year=${this.state.year}&month=${this.state.month}`
    return(
      <div>
        <TppForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Средняя за рабочую смену (09:00-18:00) температура воздуха (°С) с 01 по {endDate} года в г. Донецке</h4>
        <br/>
        <WorkShiftAvgTemperatures temperatures={this.state.temperatures} maxDay={this.state.daysInMonth} />
        <h4>Задайте параметры печати</h4>
        <table className= "table table-hover">
          <tbody>
            <tr>
              <th>Руководитель</th><th>Ответственный</th>
            </tr>
            <tr>
              <td><Select id="chief" value={this.state.chiefR} onChange={this.handleChiefSelected} options={chiefs}/></td>
              <td><Select id="responsible"value={this.state.responsibleR} onChange={this.handleResponsibleSelected} options={responsibles}/></td>
            </tr>
          </tbody>
        </table>
        <a href={desiredLink} >Распечатать</a>
        <br/>
        <a href={ref} >Зарегистрировать</a>
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
    
    ReactDOM.render(
      <Teploenergo temperatures={temperatures} year={year} month={month} />,
      document.getElementById('form_and_report')
    );
  }
});