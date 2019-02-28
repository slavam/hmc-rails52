import React from 'react';
import ReactDOM from 'react-dom';
import TeploenergoForm from './teploenergo_form';
import {Line} from 'react-chartjs-2';

const MonthTemperaturesTable = ({temperatures, maxDay}) => {
  let rows = [<tr key="0"><td>Число</td><td>Донецк</td><td>Дебальцево</td><td>Амвросиевка</td><td>Седово</td><td>Красноармейск</td><td>Волноваха</td><td>Артемовск</td><td>Мариуполь</td><td>По территории</td><td>По ДНР</td></tr>];
  
  for(var i=1; i<=maxDay+4; ++i){
    let values = [];
    let tr0;
    [1,3,2,10,8,4,7,5,11,12].forEach((j) => { // коды станций 
      let val = temperatures[i][j] == null ? '': ((j>10 || i>maxDay)? <b>{temperatures[i][j]}</b>:temperatures[i][j]);
      values.push(<td key={j}>{val}</td>);
    });
    if (i <= maxDay)
      tr0 = i;
    else if (i == maxDay+1)
      tr0 = '1 декада';
    else if (i == maxDay+2)
      tr0 = '2 декада';
    else if (i == maxDay+3)
      tr0 = '3 декада';
    else 
      tr0 = 'За месяц';
    
    rows.push(<tr key={i}><td key={i}>{tr0}</td>{values}</tr>);
  }
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};

export default class MonthAvgTemperatures extends React.Component{
  constructor(props) {
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
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
      dataType: 'json', // important!
      url: "month_avg_temp?year="+year+'&month='+month
      }).done(function(data) {
        this.setState({
          temperatures: data.temperatures
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }

  render(){
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let dataDonetsk = [];
    let dataDebaltsevo = [];
    let dataAmvrosievka = [];
    let dataVolnovaha = [];
    let dataMariupol = [];
    let dataSedovo = [];
    let dataPokrovsk = [];
    let dataArtmovsk = [];
    for(var i=1; i<=this.state.daysInMonth; ++i){
      dataDonetsk[i-1] = this.state.temperatures[i][1];
      dataDebaltsevo[i-1] = this.state.temperatures[i][3];
      dataAmvrosievka[i-1] = this.state.temperatures[i][2];
      dataSedovo[i-1] = this.state.temperatures[i][10];
      dataPokrovsk[i-1] = this.state.temperatures[i][8];
      dataVolnovaha[i-1] = this.state.temperatures[i][4];
      dataMariupol[i-1] = this.state.temperatures[i][5];
      dataArtmovsk[i-1] = this.state.temperatures[i][7];
    }
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
          label: "Седово",
          backgroundColor: 'rgba(215,199,32,0.2)',
          borderColor: 'rgba(215,109,32,1)',
          fill: false,
          data: dataSedovo
        },
        {
          label: "Красноармейск",
          backgroundColor: 'rgba(55,209,132,0.2)',
          borderColor: 'rgba(155,209,132,1)',
          fill: false,
          data: dataPokrovsk
        },
        {
          label: "Волноваха",
          backgroundColor: 'rgba(155,99,132,0.2)',
          borderColor: 'rgba(155,99,132,1)',
          fill: false,
          data: dataVolnovaha
        },
        {
          label: "Артемовск",
          backgroundColor: 'rgba(55,99,32,0.2)',
          borderColor: 'rgba(155,99,32,1)',
          fill: false,
          data: dataArtmovsk
        },
        {
          label: "Мариуполь",
          backgroundColor: 'rgba(155,199,32,0.2)',
          borderColor: 'rgba(155,199,232,1)',
          fill: false,
          data: dataMariupol
        },
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
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleDateSubmit} />
        <h4>Средняя за сутки температура воздуха (°С) с 1 по {endDate} года по данным метеорологических станций</h4>
        <Line data={lineChartData} height={100} options={options}/>
        <MonthTemperaturesTable temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    
    ReactDOM.render(
      <MonthAvgTemperatures temperatures={temperatures} year={year} month={month} />,
      document.getElementById('form_and_report')
    );
  }
});