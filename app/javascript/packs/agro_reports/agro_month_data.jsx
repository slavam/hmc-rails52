import React from 'react';
import ReactDOM from 'react-dom';
import AgroDataForm from './agro_data_form';
import {Line} from 'react-chartjs-2';

const AgroMonthTable = ({observations}) => {
  let rows = [<tr key="0"><td>Число</td><td>Донецк</td><td>Амвросиевка</td><td>Дебальцево</td><td>Волноваха</td><td>Красноармейск</td><td>Артемовск</td></tr>];
  let maxDay = observations.length-1;
  for(var i=1; i<=maxDay; ++i){
    let values = [];
    [1,2,3,4,8,7].forEach((j) => { // коды станций 
      let val = observations[i][j] ; //== null ? '': observations[i][j];
      values.push(<td key={j}>{val}</td>);
    });

    rows.push(<tr key={i}><td key={i}>{i}</td>{values}</tr>);
  }
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};

export default class AgroMonthData extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observations: this.props.observations,
      year: this.props.year,
      month: this.props.month,
      factor: this.props.factor
    };
    this.handleParamsSubmit = this.handleParamsSubmit.bind(this);
  }
  
  handleParamsSubmit(params){
    this.state.year = params.year;
    this.state.month = params.month;
    this.state.factor = params.factor;
    $.ajax({
      type: 'GET',
      dataType: 'json', // important!
      url: "agro_month_data?year="+params.year+'&month='+params.month+'&factor='+params.factor
      }).done(function(data) {
        this.setState({
          observations: data.observations
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed fetch data');
      });
  }
  render(){
    let dataName = '';
    switch(this.state.factor) {
      case 'air_avg_temp':
        dataName = 'Средняя за сутки температура воздуха (°С)';
        break;
      case 'air_max_temp':
        dataName = 'Максимальная температура воздуха за 12 часов (°С)';
        break;
      case 'air_min_temp':
        dataName = 'Минимальная за сутки температура воздуха (°С)';
        break;
      case 'soil_min_temp':
        dataName = 'Минимальная за сутки температура на поверхности почвы (°С)';
        break;
      case 'percipitation_24':
        dataName = 'Количество осадков, выпавших за сутки (мм)';
        break;
      case 'percipitation_night':
        dataName = 'Количество осадков за 12 ночных часов (мм)';
        break;
      case 'wind_speed_max':
        dataName = 'Максимальная за сутки скорость ветра (м/с)';
        break;
      case 'saturation_deficit_max':
        dataName = 'Максимальный дефицит насыщения воздуха за сутки (гПа)';
        break;
      case 'relative_humidity_min':
        dataName = 'Минимальная относительная влажность воздуха за сутки (%)';
        break;
      case 'saturation_deficit_avg':
        dataName = 'Cредний дефицит насыщения воздуха за сутки (гПа)';
        break;
    }
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = (this.state.observations.length-1)+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let dataDonetsk = [];
    let dataDebaltsevo = [];
    let dataAmvrosievka = [];
    let dataVolnovaha = [];
    let dataPokrovsk = [];
    let dataArtmovsk = [];
    let daysInMonth = this.state.observations.length-1;
    for(var i=1; i<=daysInMonth; ++i){
      dataDonetsk[i-1] = this.state.observations[i][1];
      dataDebaltsevo[i-1] = this.state.observations[i][3];
      dataAmvrosievka[i-1] = this.state.observations[i][2];
      dataPokrovsk[i-1] = this.state.observations[i][8];
      dataVolnovaha[i-1] = this.state.observations[i][4];
      dataArtmovsk[i-1] = this.state.observations[i][7];
    }
    const lineChartData = {
      labels: Array.from({length: daysInMonth}, (v, k) => k+1),
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
        <AgroDataForm year={this.state.year} month={this.state.month} factor={this.state.factor} onFormSubmit={this.handleParamsSubmit} />
        <h4>{dataName} с 1 по {endDate} года</h4>
        <Line data={lineChartData} height={100} options={options}/>
        <AgroMonthTable observations={this.state.observations} />
      </div>
    );
  }
}

$(function() {
  const node = document.getElementById('init_params');
  
  if(node){
    const observations = JSON.parse(node.getAttribute('observations'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const factor = JSON.parse(node.getAttribute('factor'));
    
    ReactDOM.render(
      <AgroMonthData observations={observations} year={year} month={month} factor={factor} />,
      document.getElementById('form_and_result')
    );
  }
});
