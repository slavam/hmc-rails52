import React from 'react';
import ReactDOM from 'react-dom';
import FireForm from './fire_form';
import {Bar} from 'react-chartjs-2';

const FireTable = ({fireData}) => {
  let row = [<tr key="0"><td>Дата</td><td>ПО</td><td>Температура</td><td>Точка росы</td><td>Осадки ночью</td><td>Осадки днем</td></tr>];
  let fds = [];
  let i = 0;
  if(fireData){
    let l = Object.keys(fireData).length;
    for(var k in fireData){
      let fd = fireData[k];
      fd['obsDate'] = k;
      fds[l-i] = fd;
      i++;
    }
    fds.forEach((e) => {
      row.push(<tr key={e['obsDate']}><td>{e['obsDate']}</td><td>{e['fire_danger']}</td><td>{e['temp']}</td><td>{e['temp_d_p']}</td><td>{e['night']}</td><td>{e['day']}</td></tr>);
    });
  }
  return <table className="table table-hover"><tbody>{row}</tbody></table>;
};

export default class Fire extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fireData: this.props.fireData,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      stationId: 1
    };
    this.handleFireFormSubmit = this.handleFireFormSubmit.bind(this);
  }
  handleFireFormSubmit(dateFrom, dateTo, stationId){
    this.state.dateFrom = dateFrom;
    this.state.dateTo = dateTo;
    this.state.stationId = stationId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/fire?date_from="+dateFrom+"&date_to="+dateTo+"&station_id="+stationId
      }).done((data) => {
        this.setState({fireData: data.data});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  render(){
    let stationName = '';
    let stationId = +this.state.stationId;
    this.props.stations.some(function(s){
      stationName = s.name;
      return stationId == s.id;
    });
    let periodDays = [];
    let fireDanger = [];
    let precipitation = [];
    if(this.state.fireData)
      Object.keys(this.state.fireData).forEach( (k) => {
        periodDays.push(k.substr(8,2)+'.'+k.substr(5,2));
        fireDanger.push(this.state.fireData[k].fire_danger);
        precipitation.push(+this.state.fireData[k].day+this.state.fireData[k].night);
      });
    const lineChartData = {
      labels: periodDays,
      datasets: [ 
        {
          type:'line',
          backgroundColor: 'rgba(255,99,32,0.2)',
          borderColor: 'rgba(255,99,32,1)',
      	  label: "Пожароопасность",
      	  data: fireDanger,
        	fill: false,
        	yAxisID: 'y-axis-1'
        }, 
        {
          type: 'bar',
          label: 'Осадки',
          data: precipitation,
          fill: false,
          backgroundColor: '#71B37C',
          borderColor: '#71B37C',
          hoverBackgroundColor: '#71B37C',
          hoverBorderColor: '#71B37C',
          yAxisID: 'y-axis-2'
        }
      ]
    };
    
    const options = {
      responsive: true,
      tooltips: {
        mode: 'label'
      },
      hover: {
        mode: 'dataset'
      },
      elements: {
        line: {
          fill: false
        }
      },
      scales: {
        yAxes: [
          {
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            gridLines: {
              display: false
            },
            labels: {
              show: true
            }
          },
          {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
              display: false
            },
            labels: {
              show: true
            }
          }
        ]
      },
      // annotation: {
      //   annotations: [{
      //     type: 'line',
      //     mode: 'horizontal',
      //     scaleID: 'y-axis-2',
      //     value: 3,
      //     borderColor: 'rgb(75, 192, 92)',
      //     borderWidth: 3,
      //     label: {
      //       enabled: true,
      //       position: 'top',
      //       content: '3 мм'
      //     }
      //   }
        // ,{
        //   type: 'line',
        //   mode: 'horizontal',
        //   scaleID: 'y-axis-1',
        //   value: 3000,
        //   borderColor: 'rgb(175, 92, 92)',
        //   borderWidth: 4,
        //   label: {
        //     enabled: true,
        //     position: 'top',
        //     content: '3000'
        //   }
        // }
        // ]
      // }
    };
    return(
      <div>
        <FireForm dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} stations={this.props.stations} onFireFormSubmit={this.handleFireFormSubmit} />
        <Bar data={lineChartData} height={100} options={options}/>
        <h4>Показатель пожарной опасности с {this.state.dateFrom} по {this.state.dateTo} на метеостанции {stationName}</h4>
        <FireTable fireData={this.state.fireData}/>
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init_params');
  if(node) {
    const fireData = JSON.parse(node.getAttribute('fireData'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    
    ReactDOM.render(
      <Fire fireData={fireData} stations={stations} dateFrom={dateFrom} dateTo={dateTo} />,
      document.getElementById('form_and_result')
    );
  }
});