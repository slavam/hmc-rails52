import React from 'react';
import ReactDOM from 'react-dom';
import TeploenergoForm from './teploenergo_form';
import {Line} from 'react-chartjs-2';

const AvgTemperatures = ({temperatures, maxDay}) => {
  let row = [<tr key="0"><td>Число</td><td>Донецк</td><td>Дебальцево</td><td>Амвросиевка</td><td>Волноваха</td><td>Мариуполь</td></tr>];
  let values = [];
  for(var i=1; i<=maxDay; ++i){
    values = [];
    [1,3,2,4,5].forEach((j) => { // коды станций 1-5
      let key = ('0'+i).slice(-2)+'-'+j;
      let val = temperatures[key] == null ? '': temperatures[key];
      values.push(<td key={j}>{val}</td>);
    });
    row.push(<tr key={i}><td key={i}>{i}</td>{values}</tr>);
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
    let dataDonetsk = [];
    Object.keys(this.state.temperatures).forEach((k) => {if(k[3]=='1') dataDonetsk[+k.substr(0,2)-1]=this.state.temperatures[k]});
    let dataDebaltsevo = [];
    Object.keys(this.state.temperatures).forEach((k) => {if(k[3]=='3') dataDebaltsevo[+k.substr(0,2)-1]=this.state.temperatures[k]});
    let dataAmvrosievka = [];
    Object.keys(this.state.temperatures).forEach((k) => {if(k[3]=='2') dataAmvrosievka[+k.substr(0,2)-1]=this.state.temperatures[k]});
    let dataVolnovaha = [];
    Object.keys(this.state.temperatures).forEach((k) => {if(k[3]=='4') dataVolnovaha[+k.substr(0,2)-1]=this.state.temperatures[k]});
    let dataMariupol = [];
    Object.keys(this.state.temperatures).forEach((k) => {if(k[3]=='5') dataMariupol[+k.substr(0,2)-1]=this.state.temperatures[k]});
    const lineChartData = {
      labels: Array.from({length: this.state.daysInMonth}, (v, k) => k+1),
      datasets: [ 
        {
          backgroundColor: 'rgba(255,99,32,0.2)',
          borderColor: 'rgba(255,99,32,1)',
      	  label: "Донецк",
      	  data: dataDonetsk,
        	fill: false,
        }, 
        {
          label: "Дебальцево",
          backgroundColor: 'rgba(55,199,32,0.2)',
          borderColor: 'rgba(55,199,32,1)',
          fill: false,
          data: dataDebaltsevo
        },
        {
          label: "Амвросиевка",
          backgroundColor: 'rgba(55,99,232,0.2)',
          borderColor: 'rgba(55,99,232,1)',
          fill: false,
          data: dataAmvrosievka
        },
        {
          label: "Волноваха",
          backgroundColor: 'rgba(155,99,132,0.2)',
          borderColor: 'rgba(155,99,132,1)',
          fill: false,
          data: dataVolnovaha
        },
        {
          label: "Мариуполь",
          backgroundColor: 'rgba(155,199,32,0.2)',
          borderColor: 'rgba(155,199,232,1)',
          fill: false,
          data: dataMariupol
        }
      ]
    };
    let options = {
    	responsive: true,
	    title: {		
	      display: false,
		    text: 'Chart.js Line Chart'
      },
  		tooltips: {
        mode: 'label'
      },
  		hover: {
        mode: 'dataset'
      },
    };
    return(
      <div>
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Средняя за сутки температура воздуха (°С) с 1 по {endDate} года по данным метеорологических станций</h4>
        <Line data={lineChartData} height={100} options={options}/>
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