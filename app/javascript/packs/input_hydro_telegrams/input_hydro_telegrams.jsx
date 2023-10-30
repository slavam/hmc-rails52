import React from 'react';
import ReactDOM from 'react-dom';
import NewHydroTelegram from './new_hydro_telegram';
import HydroTelegramRow from './hydro_telegram_row';
import { copyToClipboard } from '../synoptic_data/about_clipboard';

const LastHydroTelegramsTable = ({lastTelegrams, hydroPosts}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    rows.push(<HydroTelegramRow telegram={t} key={t.id} hydroPosts={hydroPosts}/>);
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th width = "100px">Дата наблюдения</th>
          <th>Гидрологический пост</th>
          <th>Текст</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class InputHydroTelegrams extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inputMode: this.props.inputMode,
      observationDate: this.props.observationDate,
      lastTelegrams: this.props.lastTelegrams,
      errors: [],
    };
    this.handleInBuffer = this.handleInBuffer.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.toClipboard = this.toClipboard.bind(this)
  }
  handleFormSubmit(formData) {
    let tlgData = {};
    var desiredLink = '';
    tlgData = {hydro_observation: formData.observation};
    desiredLink = "/hydro_observations/create_hydro_telegram?date="+formData.observationDate+"&input_mode="+this.state.inputMode;
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: tlgData, 
      url: desiredLink
      }).done((data) => {
        this.setState({lastTelegrams: data.telegrams, observationDate: data.observationDate, inputMode: data.inputMode, errors: data.errors});
        alert(this.state.errors[0]);
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в базу"]});
      });    
  }
  handleInBuffer(forBuffer){
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: forBuffer, 
      url: "/applicants/to_buffer"
      }).done((data) => {
        this.setState({errors: []});
        alert("Данные занесены в буфер");
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в буфер"]});
      });
  }
  toClipboard(e){
    let text = ""
    let message = ''
    let ts = []
    ts = this.state.lastTelegrams.filter(t => this.state.observationDate===t.date)
    message = `Скопировано ${ts.length} hydro тлг. за ${this.state.observationDate}`
    ts.forEach((t) => {text += t.telegram+'\n'})
    copyToClipboard(text)
    alert(message);
  }
  render(){
    let toClipboardButton = this.props.hydroPostCode == '' ? 
      <button onClick={event => this.toClipboard(event)}>Скопировать последние</button> : null
    return(
      <div>
        <h3>Новая телеграмма</h3>
        <NewHydroTelegram observationDate={this.state.observationDate} onFormSubmit={this.handleFormSubmit} hydroPosts={this.props.hydroPosts} inputMode={this.props.inputMode} onInBuffer={this.handleInBuffer} hydroPostCode={this.props.hydroPostCode}/>
        <h3>Телеграммы hydro (HHZZ)</h3> 
        {toClipboardButton}
        <LastHydroTelegramsTable lastTelegrams={this.state.lastTelegrams} hydroPosts={this.props.hydroPosts}/>
      </div>
    );
  }
}
$(function () {
  const node = document.getElementById('init_params');
  if(node) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    const lastTelegrams = JSON.parse(node.getAttribute('telegrams'));
    const observationDate = JSON.parse(node.getAttribute('currDate'));
    const hydroPosts = JSON.parse(node.getAttribute('hydroPosts'));
    const inputMode = JSON.parse(node.getAttribute('inputMode'));
    const hydroPostCode = JSON.parse(node.getAttribute('hydroPostCode'))
    ReactDOM.render(
      <InputHydroTelegrams lastTelegrams={lastTelegrams} 
        hydroPosts={hydroPosts} observationDate={observationDate} inputMode={inputMode} hydroPostCode={hydroPostCode}/>,
      document.getElementById('form_and_last_telegrams')
    );
  }
});