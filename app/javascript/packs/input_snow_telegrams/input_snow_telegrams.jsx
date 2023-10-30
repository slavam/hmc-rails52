import React from 'react';
import ReactDOM from 'react-dom';
import NewSnowTelegram from './new_snow_telegram';
import SnowTelegramRow from './snow_telegram_row';
import { copyToClipboard } from '../synoptic_data/about_clipboard';

const LastSnowTelegramsTable = ({lastTelegrams, tlgType, snowPoints}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    rows.push(<SnowTelegramRow telegram={t} key={t.id} tlgType={tlgType} snowPoints={snowPoints}/>);
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th width = "100px">Дата съемки</th>
          <th>Пункт снегосъемки</th>
          <th>Текст</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class InputSnowTelegrams extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inputMode: this.props.inputMode,
      observationDate: this.props.observationDate,
      tlgType: this.props.tlgType,
      lastTelegrams: this.props.lastTelegrams,
      errors: [],
    };
    this.handleTelegramTypeChanged = this.handleTelegramTypeChanged.bind(this);
    this.handleInBuffer = this.handleInBuffer.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.toClipboard = this.toClipboard.bind(this)
  }
  
  handleTelegramTypeChanged(tlgType){
  }
  
  handleFormSubmit(formData) {
    let tlgData = {};
    var desiredLink = '';
    switch(formData.tlgType) {
      case 'snow':
        tlgData = {snow_observation: formData.observation};
        desiredLink = "/snow_observations/create_snow_telegram?date="+formData.observationDate+"&input_mode="+this.state.inputMode;
        break;
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: tlgData, 
      url: desiredLink
      }).done((data) => {
        this.setState({lastTelegrams: data.telegrams, tlgType: data.tlgType, observationDate: data.observationDate, inputMode: data.inputMode, errors: data.errors});
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
    message = `Скопировано ${ts.length} snow тлг. за ${this.state.observationDate}`
    ts.forEach((t) => {text += t.telegram+'\n'})
    copyToClipboard(text)
    alert(message);
  }
  render(){
    let toClipboardButton = this.props.hydroPostCode == '' ? 
      <button onClick={event => this.toClipboard(event)}>Скопировать последние</button> : null
    return(
      <div>
        <h3>Новая телеграмма о снегомерных съемках</h3>
        <NewSnowTelegram observationDate={this.state.observationDate} tlgType={this.state.tlgType} onTelegramTypeChange={this.handleTelegramTypeChanged} onFormSubmit={this.handleFormSubmit} snowPoints={this.props.snowPoints} inputMode={this.props.inputMode} onInBuffer={this.handleInBuffer} hydroPostCode={this.props.hydroPostCode}/>
        <h3>Телеграммы {this.state.tlgType} (HHSS)</h3> 
        {toClipboardButton}
        <LastSnowTelegramsTable lastTelegrams={this.state.lastTelegrams} tlgType={this.state.tlgType} snowPoints={this.props.snowPoints}/>
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node) {
    const lastTelegrams = JSON.parse(node.getAttribute('telegrams'));
    const observationDate = JSON.parse(node.getAttribute('currDate'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
    const snowPoints = JSON.parse(node.getAttribute('snowPoints'));
    const inputMode = JSON.parse(node.getAttribute('inputMode'));
    const hydroPostCode = JSON.parse(node.getAttribute('hydroPostCode'))
    ReactDOM.render(
      <InputSnowTelegrams lastTelegrams={lastTelegrams} 
        snowPoints={snowPoints} observationDate={observationDate} tlgType={tlgType} inputMode={inputMode} hydroPostCode={hydroPostCode}/>,
      document.getElementById('form_and_last_telegrams')
    );
  }
});