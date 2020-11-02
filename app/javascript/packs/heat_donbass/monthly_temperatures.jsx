import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const MonthlyTemperaturesTable = ({temperatures, maxDay}) => {
  let rows = [<tr><td style={{borderColor:"black"}} align="center"><b>Число</b></td><td style={{borderColor:"black"}} align="center"><b>Донецк</b></td><td style={{borderColor:"black"}} align="center"><b>Дебальцево</b></td><td style={{borderColor:"black"}} align="center"><b>Амвросиевка</b></td><td style={{borderColor:"black"}} align="center"><b>Седово</b></td></tr>];
  if (temperatures){
    for(var i=1; i<=maxDay; ++i){
      let values = [];
      [1,3,2,4].forEach((j) => {
      // for(var j=1; j<5; ++j){
        let val = '';
        if((temperatures[i] != null) && (temperatures[i][j] != null)){
          val = temperatures[i][j];
        }
        values.push(<td style={{borderColor:"black"}} key={j} align="center">{val}</td>);
      })
      rows.push(<tr key={i}><td style={{borderColor:"black"}} align="center" key={i}>{i}</td>{values}</tr>);
    }
    return <table className="table table-bordered" ><tbody>{rows}</tbody></table>;
  }else{
    return <div></div>
  }
}

export default class MonthlyTemperatures extends React.Component {
  constructor(props) {
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      variant: this.props.variant,
      daysInMonth: n
    };
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }
  handleDateSubmit(year, month) {
    this.state.year = year;
    this.state.month = month;
    this.state.daysInMonth = new Date(+year, +month, 0).getDate();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "monthly_temperatures?year="+year+'&month='+month+'&variant='+this.state.variant
      }).done(function(data) {
        this.setState({
          temperatures: data.temperatures
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('Проблемы с БД');
      });
  }
  getMonth(idx) {
    var objDate = new Date();
    objDate.setDate(1);
    objDate.setMonth(idx-1);
    return objDate.toLocaleString("ru", {month: "long"});
  }
  render(){
    let hour = this.state.variant == 'temp' ? '8' : '16';
    return(
      <div>
        <MonthYearForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleDateSubmit} />
        <h4>Температура воздуха на {hour} часов (°С) за {this.getMonth(this.state.month)} {this.state.year}</h4>
        <MonthlyTemperaturesTable temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>
      </div>
    );
  }
}
$(() => {
  const node = document.getElementById('init_params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const variant = JSON.parse(node.getAttribute('variant'));

    ReactDOM.render(
      <MonthlyTemperatures temperatures={temperatures} year={year} month={month} variant={variant}/>,
      document.getElementById('root')
    );
  }
});
