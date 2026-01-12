import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import TeploenergoForm from './teploenergo_form';

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
export default class AmvrosievkaTempCSDN extends React.Component{
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
      url: "/synoptic_observations/amvrosievka_daily_avg_temp_csdn?year="+year+"&month="+month
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
      {value: 'Arameleva', label: 'Арамелева О.В.'},
      {value: 'Lukjanenko', label: 'Лукьяненко М.Б.'},
      {value: 'Kijanenko', label: 'Кияненко М.А.'},
    ];
    const responsibles = [
      {value: 'Boyko', label: 'Бойко Л.Н.'},
      {value: 'Arameleva', label: 'Арамелева О.В.'},
    ];
    let desiredLink = "/synoptic_observations/amvrosievka_daily_avg_temp_csdn.pdf?year="+this.state.year+"&month="+this.state.month+"&chief="+this.state.chiefR.value+"&responsible="+this.state.responsibleR.value;
    let pr =  <div>
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
              </div>
    let ct = "пгт. Новый Свет"
    if(this.props.city == 'A') {
      pr = null
      ct = 'г. Амвросиевка'
    }
    return(
      <div>
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Средняя за сутки температура воздуха (°С) с 01 по {endDate} года в {ct}</h4>
        <br/>
        <WorkShiftAvgTemperatures temperatures={this.state.temperatures} maxDay={this.state.daysInMonth} />
        
        {pr}
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
    const city = JSON.parse(node.getAttribute('city'));
    
    ReactDOM.render(
      <AmvrosievkaTempCSDN temperatures={temperatures} year={year} month={month} city={city}/>,
      document.getElementById('root')
    );
  }
});