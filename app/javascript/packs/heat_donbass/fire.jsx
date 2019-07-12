import React from 'react';
import ReactDOM from 'react-dom';
import FireForm from './fire_form';

const FireTable = ({fireData}) => {
  let row = [<tr key="0"><td>Дата</td><td>ПО</td><td>Температура</td><td>Точка росы</td><td>Осадки ночью</td><td>Осадки днем</td></tr>];
  Object.keys(fireData).forEach( (k) => {
    row.push(<tr key={k}><td>{k}</td><td>99999</td><td>{fireData[k]['temp']}</td><td>{fireData[k]['temp_d_p']}</td><td>{fireData[k]['night']}</td><td>{fireData[k]['day']}</td></tr>);
  });
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
        this.setState({fireData: data.fireData});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    return(
      <div>
        <FireForm dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} stations={this.props.stations} onFireFormSubmit={this.handleFireFormSubmit} />
        <h4>Показатель пожарной опасности с {this.state.dateFrom} по {this.state.dateTo} на метеостанции {this.state.stationId}</h4>
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