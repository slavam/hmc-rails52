import React from 'react';
import ReactDOM from 'react-dom';
import NewTelegramForm from './new_telegram_form';
import TelegramRow from './telegram_row';
// import MakeSynopticTelegram from './make_synoptic_telegram';

// import { Observable} from 'rxjs/Observable';
// import { range } from 'rxjs/observable/range';

// import { Observable, range } from 'rxjs';
// import { of } from 'rxjs/observable/of';
// import { map, fromPromise } from 'rxjs/operators';

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
          <th width = "200px">Дата { tlgType == 'storm' ? 'ввода' : ''}</th>
          { tlgType == 'synoptic' ? <th>Срок</th> : <th></th>}
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
      minutes: 0,
      codeStation: this.props.codeStation ? this.props.codeStation : 'XXXXX', // HES 20190504
      inputMode: this.props.inputMode,
      currDate: this.props.currDate,
      tlgType: this.props.tlgType,
      tlgTerm: this.props.term,
      errors: [],
      telegrams: this.props.telegrams
    };
    this.snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTelegramTypeChanged = this.handleTelegramTypeChanged.bind(this);
    this.handleInBuffer = this.handleInBuffer.bind(this);
    this.updateTelegramsState = this.updateTelegramsState.bind(this);
    this.tick = this.tick.bind(this);
  }
  
  tick(){
      // This function is called every sec.
    
    if (this.state.inputMode == 'normal' && this.state.tlgType == 'synoptic'){
      let d = new Date();
      let t = Math.floor(d.getUTCHours() / 3) * 3;
      // let m = d.getUTCMinutes();
      // if(this.state.minutes != m){
      //   console.log(+this.state.tlgTerm+'; '+t);
      //   this.setState({minutes: m});
      //   // alert (t+'; tlgTerm=>'+(+this.state.tlgTerm))
      // }
        
      if (t != (+this.state.tlgTerm)){
        // console.log('Смена срока t=>'+t+'; this.state.tlgTerm=>'+(+this.state.tlgTerm));
        this.setState({ tlgTerm: ('0'+t).slice(-2), currDate: d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2)});
      }
    }
  }

  handleTelegramTypeChanged(tlgType, tlgTerm){
    var desiredLink = '';
    if(tlgType == 'radiation_daily')
      desiredLink = "/radiation_observations/get_last_telegrams?factor=daily";
    else
      desiredLink = "/"+tlgType+"_observations/get_last_telegrams";
    this.state.tlgTerm = tlgTerm;
    // this.setState({tlgType: tlgType});
    // var result = Observable.fromPromise(fetch(desiredLink));
    // result.subscribe(x => console.log(x.telegrams.length), e => console.error(e));
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: desiredLink
    }).done((data) => {
        // this.setState({telegrams: data.telegrams, tlgType: data.tlgType, errors: []});
      this.setState({telegrams: data.telegrams, tlgType: tlgType, codeStation: data.codeStation, errors: []});
    }).fail((res) => {
      this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  
  handleFormSubmit(telegram) {
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
      case 'radiation':
        tlgData = {radiation_observation: telegram.observation};
        desiredLink = "/radiation_observations/create_radiation_telegram?date="+telegram.currDate+"&inputMode="+this.state.inputMode;
        break;
      case 'radiation_daily':
        tlgData = {radiation_observation: telegram.observation};
        desiredLink = "/radiation_observations/create_radiation_telegram?date="+telegram.currDate+"&inputMode="+this.state.inputMode+"&factor=daily";
        break;
      case 'sea':
        tlgData = {sea_observation: telegram.observation};
        desiredLink = "/sea_observations/create_sea_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
        break;
      // case 'hydro':
      //   tlgData = {hydro_observation: telegram.observation};
      //   desiredLink = "/hydro_observations/create_hydro_telegram?date="+telegram.currDate+"&input_mode="+this.state.inputMode;
      //   break;
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: tlgData, 
      url: desiredLink
      }).done((data) => {
        // 2018.12.29
        this.setState({telegrams: data.telegrams, tlgType: data.tlgType, currDate: data.currDate, inputMode: data.inputMode, errors: data.errors});
        alert(this.state.errors[0]);
        // this.setState({errors: ["Данные сохранены"]});
        // alert(this.state.errors[0]);
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
        // alert("Данные занесены в буфер");
        alert(data.errors[0]);
        this.setState({errors: []});
      }).fail((res) => {
        this.setState({errors: ["Ошибка записи в буфер"]});
      }); 
  }

  updateTelegramsState(telegram) {
    let telegrams = [...this.state.telegrams];
    let telegramsCopy = telegrams.slice();
    let telegramId = telegramsCopy.findIndex((element, index, array) => element.id == telegram.id);
    if (telegramId == -1) {
      telegramsCopy = [telegram].concat(telegrams);
    } else {
      telegramsCopy[telegramId] = telegram;
    }
    this.setState( {telegrams: telegramsCopy} );
  }
  
  render(){
    this.timer = setInterval(this.tick, 1000);
    // console.log(new Date());
    App.candidate = App.cable.subscriptions.create({
        channel: "SynopticTelegramChannel", 
      },
      {received: data => {
        if(data.tlgType == 'storm')
          this.snd.play();
        if(this.state.tlgType == data.tlgType){
          this.updateTelegramsState(data.telegram);
        }
      }
    });

    // var source = Observable.range(1, 5);
    // var source = range(1, 5);
    // var subscription = source.subscribe(
    // 	function (x) { console.log('onNext: ' + x); },
    // 	function (e) { console.log('onError: ' + e.message); },
    // 	function () { console.log('onCompleted'); });
    	
    let telegramTable = this.props.telegrams.length > 0 ? 
      <div>
        <h3>Телеграммы {this.state.tlgType}</h3> 
        <LastTelegramsTable telegrams={this.state.telegrams} tlgType={this.state.tlgType} stations={this.props.stations}/>
      </div> : '';
    return(
      <div>
        {/*<MakeSynopticTelegram term={this.state.tlgTerm} stations={this.props.stations} weatherInTerm={this.props.weatherInTerm} weatherPast={this.props.weatherPast}/>*/}
        <h3>Новая телеграмма</h3>
        <NewTelegramForm codeStation={this.state.codeStation} currDate={this.state.currDate} tlgType={this.state.tlgType} onTelegramTypeChange={this.handleTelegramTypeChanged} onFormSubmit={this.handleFormSubmit} stations={this.props.stations} tlgTerm={this.state.tlgTerm} inputMode={this.props.inputMode} onInBuffer={this.handleInBuffer} minutes={this.state.minutes}/>
        {telegramTable}
      </div>
    );
  }
}

// document.addEventListener('turbolinks:load', () => {
$(function () {
  const node = document.getElementById('input_params');
  if(node) {
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const currDate = JSON.parse(node.getAttribute('currDate'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const term = JSON.parse(node.getAttribute('term'));
    const inputMode = JSON.parse(node.getAttribute('inputMode'));
    const codeStation = JSON.parse(node.getAttribute('codeStation'));
    const weatherInTerm = JSON.parse(node.getAttribute('weatherInTerm'));
    const weatherPast = JSON.parse(node.getAttribute('weatherPast'));
    
    ReactDOM.render(
      <InputTelegrams telegrams={telegrams} stations={stations} currDate={currDate} tlgType={tlgType} term={term} inputMode={inputMode} codeStation={codeStation} weatherInTerm={weatherInTerm} weatherPast={weatherPast}/>,
      document.getElementById('form_and_last_telegrams')
    );
  }
});