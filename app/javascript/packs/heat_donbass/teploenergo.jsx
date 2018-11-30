import React from 'react';
import ReactDOM from 'react-dom';
import TeploenergoForm from './teploenergo_form';

const AvgTemperatures = ({temperatures, maxDay}) => {
  let row = [<tr><td>Число</td><td>Донецк</td><td>Дебальцево</td><td>Амвросиевка</td><td>Волноваха</td><td>Мариуполь</td></tr>];
  let values = [];
  for(var i=1; i<=maxDay; ++i){
    values = [];
    [1,3,2,4,5].forEach((j) => { // коды станций 1-5
      let key = ('0'+i).slice(-2)+'-'+j;
      let val = temperatures[key] == null ? '': temperatures[key];
      values.push(<td>{val}</td>);
    });
    row.push(<tr key={i}><td>{i}</td>{values}</tr>);
  }
  return <table className="table table-hover"><tbody>{row}</tbody></table>;
};
export default class Teploenergo extends React.Component{
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
      url: "/synoptic_observations/teploenergo?year="+year+"&month="+month
      }).done((data) => {
        this.setState({temperatures: data.temperatures});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let desiredLink = "/synoptic_observations/teploenergo.pdf?year="+this.state.year+"&month="+this.state.month;
    return(
      <div>
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Средняя за сутки температура воздуха (°С) с 1 по {endDate} года по данным метеорологических станций</h4>
        <AvgTemperatures temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>
        <a href={desiredLink}>Распечатать</a>
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