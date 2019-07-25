import React from 'react';
import ReactDOM from 'react-dom';
import FireMap from '../map/fire_map';
import ReportDateForm from './report_date_form';

export default class DailyFireDanger extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fireDangers: this.props.fireDangers,
      reportDate: this.props.reportDate
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(date){
    this.state.reportDate = date;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'daily_fire_danger?report_date='+date
      }).done(function(data) {
        this.setState({fireDangers: data.fireDangers});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка выборки из базы"]});
      }.bind(this)); 
  }
  
  render(){
    let map = <FireMap stations={this.props.stations} fireDangers={this.state.fireDangers}/>;
    return (
      <div>
        <ReportDateForm onDateSubmit={this.handleSubmit} reportDate={this.state.reportDate} />
        <div>
          {map}
        </div>
        <h3>Пожароопасность</h3>
        {/*<FoundTelegrams fact={fact} telegrams={this.state.telegrams} tlgType={this.props.tlgType} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} tlgTerm={this.state.tlgTerm} tlgText={this.state.tlgText} stationId={this.state.stationId}/>*/}
      </div>
    );

  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node){
    const reportDate = JSON.parse(node.getAttribute('reportDate'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const fireDangers = JSON.parse(node.getAttribute('fireDangers'));
  
    ReactDOM.render(
      <DailyFireDanger fireDangers={fireDangers} stations={stations} reportDate={reportDate}  />,
      document.getElementById('form_and_result')
    );
  } 
})