import React from 'react';
import { checkSnowTelegram } from './check_snow_telegram';

export default class NewSnowTelegram extends React.Component{
  constructor(props){
    super(props);
    this.tlgHead = (this.props.hydroPostCode==''?'':`${this.props.hydroPostCode} ${this.props.observationDate.substr(8,2)}${this.props.observationDate.substr(5,2)}${this.props.observationDate[3]} =`);
    this.state = {
      tlgText: this.tlgHead,
      tlgType: this.props.tlgType,
      observationDate: this.props.observationDate,
      errors: []
    };
  }
  
  handleTextChange(e){
    this.setState({tlgText: e.target.value, errors: []});  
  }
  
  dateChange(e){
    this.setState({observationDate: e.target.value, errors: []});
  }
  
  handleSubmit(e) {
    e.preventDefault();
    var text = this.state.tlgText.replace(/\s+/g, ' ').trim(); // one space only
    var errors = [];
    this.state.errors = [];
    if (!text) {
      this.setState({errors: ["Нет текста телеграммы"]});
      return;
    }
    this.observation = {};
    
    switch (this.state.tlgType) {
      case 'snow': 
        if (!checkSnowTelegram(text, this.props.snowPoints, errors, this.observation, this.state.observationDate)) {
          this.setState({errors: errors});
          return;
        }
        this.observation.telegram = text;
      break;
    }
    this.props.onFormSubmit({observation: this.observation, observationDate: this.state.observationDate, tlgType: this.state.tlgType});
    this.setState({
      tlgText: this.tlgHead,
      errors: []
    });
  }
  
  inBufferClick(e){
    this.props.onInBuffer({tlgText: this.state.tlgText, message: this.state.errors[0], tlgType: this.state.tlgType});
    this.setState({errors: []});
  }
  
  render(){
    let inBuffer = ((this.state.errors[0] > '') && (this.state.tlgText > '')) ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    let obsDate = this.props.inputMode == 'normal' ? this.state.observationDate : <input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required={true} autoComplete="on" />
    return(
      <div>
        <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
          <label htmlFor='observ-date'>Дата наблюдения </label>
          <br/>
          <span id='observ-date'>{obsDate}</span>
          <p><b>Текст</b>
            <input type="text" value={this.state.tlgText} onChange={(event) => this.handleTextChange(event)}/>
            <span style={{color: 'red'}}>{this.state.errors[0]}</span>
            {inBuffer}
          </p>
          <input type="submit" value="Сохранить" />
        </form>
      </div>
    );
  }
}