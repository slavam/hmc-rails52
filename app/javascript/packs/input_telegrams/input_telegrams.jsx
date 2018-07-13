import React from 'react';
import ReactDOM from 'react-dom';
import NewTelegramForm from './new_telegram_form';
import TelegramRow from './telegram_row';

const LastTelegramsTable = ({telegrams, tlgType, stations}) => {
  var rows = [];
  telegrams.forEach((t) => {
    t.date = t.date.replace(/T/, " ");
    rows.push(<TelegramRow telegram={t} key={t.id} tlgType={tlgType} stations={stations}/>);
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th width = "200px">Дата</th>
          { tlgType == 'synoptic' ? <th>Срок</th> : '' }
          <th>Метеостанция</th>
          <th>Текст</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class InputTelegrams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      inputMode: this.props.inputMode,
      currDate: this.props.currDate,
      tlgType: this.props.tlgType,
      tlgTerm: this.props.term,
      errors: [],
      telegrams: this.props.telegrams
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTelegramTypeChanged = this.handleTelegramTypeChanged.bind(this);
    this.handleInBuffer = this.handleInBuffer.bind(this);
  }

  handleTelegramTypeChanged(tlgType, tlgTerm){
    var that = this;
    var desiredLink = "/"+tlgType+"_observations/get_last_telegrams";
    this.state.tlgTerm = tlgTerm;
    this.setState({tlgType: tlgType});
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: desiredLink
      }).done((data) => {
        that.setState({telegrams: data.telegrams, tlgType: data.tlgType, errors: []});
      }).fail((res) => {
        that.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  
  handleFormSubmit(telegram) {
    var that = this;
    var tlgData = {};
    var desiredLink = '';
    switch(telegram.tlgType) {
      case 'synoptic':
        tlgData = {observation: telegram.observation},
        desiredLink = "/synoptic_observations/create_synoptic_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
        break;
      case 'agro':
        let c_d = telegram.observation.damage_crops;
        let c_c = telegram.observation.state_crops;
        tlgData = {agro_observation: telegram.observation, crop_conditions: c_c, crop_damages: c_d};
        if (telegram.observation.state_crops)
          delete telegram.observation.state_crops;
        if (telegram.observation.damage_crops)
          delete telegram.observation.damage_crops;
        desiredLink = "/agro_observations/create_agro_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
        break;
      case 'agro_dec':
        c_c = telegram.observation.state_crops;
        tlgData = {agro_dec_observation: telegram.observation, crop_dec_conditions: c_c};
        if (telegram.observation.state_crops)
          delete telegram.observation.state_crops;
        desiredLink = "/agro_dec_observations/create_agro_dec_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
        break;
      case 'storm':
        tlgData = {storm_observation: telegram.observation};
        desiredLink = "/storm_observations/create_storm_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
        break;
      case 'sea':
        tlgData = {sea_observation: telegram.observation};
        desiredLink = "/sea_observations/create_sea_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: tlgData, 
      url: desiredLink
      }).done((data) => {
        that.setState({telegrams: data.telegrams, tlgType: data.tlgType, currDate: data.currDate, inputMode: data.inputMode, errors: data.errors});
        alert(this.state.errors[0]);
      }).fail((res) => {
        that.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  
  handleInBuffer(forBuffer){
    var that = this;
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: forBuffer, 
      url: "/applicants/to_buffer"
      }).done((data) => {
        that.setState({telegrams: data.telegrams, tlgType: data.tlgType, currDate: data.currDate, inputMode: "normal", errors: []});
        alert("Данные занесены в буфер");
      }).fail((res) => {
        that.setState({errors: ["Ошибка записи в буфер"]});
      }); 
  }

  render(){
    let telegramTable = this.props.telegrams.length > 0 ? <div>
      <h3>Телеграммы {this.state.tlgType}</h3> 
      <LastTelegramsTable telegrams={this.state.telegrams} tlgType={this.state.tlgType} stations={this.props.stations}/>
      </div> : '';
    return(
      <div>
        <h3>Новая телеграмма</h3>
        <NewTelegramForm currDate={this.state.currDate} tlgType={this.state.tlgType} onTelegramTypeChange={this.handleTelegramTypeChanged} onFormSubmit={this.handleFormSubmit} stations={this.props.stations} term={this.props.term} inputMode={this.props.inputMode} onInBuffer={this.handleInBuffer}/>
        {telegramTable}
      </div>
    );
  }
}

document.addEventListener('turbolinks:load', () => {
  const node = document.getElementById('input_params');
  const telegrams = JSON.parse(node.getAttribute('telegrams'));
  const currDate = JSON.parse(node.getAttribute('currDate'));
  const tlgType = JSON.parse(node.getAttribute('tlgType'));
  const stations = JSON.parse(node.getAttribute('stations'));
  const term = JSON.parse(node.getAttribute('term'));
  const inputMode = JSON.parse(node.getAttribute('inputMode'));
  
  ReactDOM.render(
    <InputTelegrams telegrams={telegrams} stations={stations} currDate={currDate} tlgType={tlgType} term={term} inputMode={inputMode}/>,
    document.getElementById('form_and_last_telegrams')
  );
});