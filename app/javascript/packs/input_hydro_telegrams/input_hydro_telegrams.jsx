import React from 'react';
import ReactDOM from 'react-dom';
import NewHydroTelegram from './new_hydro_telegram';
import HydroTelegramRow from './hydro_telegram_row';

const LastHydroTelegramsTable = ({lastTelegrams, tlgType, hydroPosts}) => {
  var rows = [];
  lastTelegrams.forEach((t) => {
    rows.push(<HydroTelegramRow telegram={t} key={t.id} tlgType={tlgType} hydroPosts={hydroPosts}/>);
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
      tlgType: this.props.tlgType,
      lastTelegrams: this.props.lastTelegrams,
      errors: [],
    };
    this.handleTelegramTypeChanged = this.handleTelegramTypeChanged.bind(this);
    this.handleInBuffer = this.handleInBuffer.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  handleTelegramTypeChanged(tlgType){
  }
  
  handleFormSubmit(formData) {
    let tlgData = {};
    var desiredLink = '';
    switch(formData.tlgType) {
      case 'hydro':
        tlgData = {hydro_observation: formData.observation};
        desiredLink = "/hydro_observations/create_hydro_telegram?date="+formData.observationDate+"&input_mode="+this.state.inputMode;
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
        // this.setState({telegrams: data.telegrams, tlgType: data.tlgType, currDate: data.currDate, inputMode: "normal", errors: []});
        this.setState({errors: []});
        alert("Данные занесены в буфер");
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в буфер"]});
      });
  }
  
  render(){
    return(
      <div>
        <h3>Новая телеграмма</h3>
        <NewHydroTelegram observationDate={this.state.observationDate} tlgType={this.state.tlgType} onTelegramTypeChange={this.handleTelegramTypeChanged} onFormSubmit={this.handleFormSubmit} hydroPosts={this.props.hydroPosts} inputMode={this.props.inputMode} onInBuffer={this.handleInBuffer}/>
        <h3>Телеграммы {this.state.tlgType}</h3> 
        <LastHydroTelegramsTable lastTelegrams={this.state.lastTelegrams} tlgType={this.state.tlgType} hydroPosts={this.props.hydroPosts}/>
      </div>
    );
  }
  
}

// document.addEventListener('turbolinks:load', () => {
$(function () {
  const node = document.getElementById('init_params');
  if(node) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    const lastTelegrams = JSON.parse(node.getAttribute('telegrams'));
    const observationDate = JSON.parse(node.getAttribute('currDate'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
    const hydroPosts = JSON.parse(node.getAttribute('hydroPosts'));
    const inputMode = JSON.parse(node.getAttribute('inputMode'));
    ReactDOM.render(
      <InputHydroTelegrams lastTelegrams={lastTelegrams} hydroPosts={hydroPosts} observationDate={observationDate} tlgType={tlgType} inputMode={inputMode}/>,
      document.getElementById('form_and_last_telegrams')
    );
  }
});