import React from 'react';
import ReactDOM from 'react-dom';
import DownloadParams from './download_params';

export default class TelegramsForDownload extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      date: this.props.date,
      term: this.props.term,
      total: 0,
      ourTelegramsNum: 0,
      webTelegramsNum: 0
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleFormSubmit(date, term){
    this.state.date = date;
    this.state.term = term;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/arm_sin_data_fetch?date="+date+'&term='+term
      }).done((data) => {
        this.setState({date: date, term: term, total: data.total, ourTelegramsNum: data.ourTelegramsNum, webTelegramsNum: data.webTelegramsNum});
        // alert(date+'<==>'+this.state.date)
        // alert(this.state.errors[0]);
      }).fail((res) => {
        alert(this.state.errors[0]);
        this.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  render(){
    return(
      <div>
        <h3>Формирование данных для программы ARM_SIN</h3>
        <DownloadParams date={this.state.date} term={this.state.term} onSubmit={this.handleFormSubmit}/>
        <p>
        Дата: {this.state.date}
        <br/>
        Срок: {this.state.term}
        <br/>
        Отобрано телеграмм из БД ГМЦ: {this.state.ourTelegramsNum}
        <br/>
        Отобрано телеграмм из БД ogimet: {this.state.webTelegramsNum}
        <br/>
        Число телеграмм в файле: {this.state.total}
        </p>
      </div>
    );
  }
}

$(function(){
// document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('input_params');
  if(node){
    const date = JSON.parse(node.getAttribute('date'));
    const term = JSON.parse(node.getAttribute('term'));
    
    ReactDOM.render(
      <TelegramsForDownload date={date} term={term} />,
      document.getElementById('form_and_filelist')
    );
  }
})