import React from 'react';
import { checkHydroTelegram } from './check_hydro_telegram';

export default class NewHydroTelegram extends React.Component{
  constructor(props){
    super(props);
    this.tlgHead = (this.props.hydroPostCode==''?'':`${this.props.hydroPostCode} ${this.props.observationDate.substr(8,2)}081 =`);
    this.state = {
      tlgText: this.tlgHead,
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
    if (!text) {
      this.setState({errors: ["Нет текста телеграммы"]});
      return;
    }
    this.observation = {};
    if (!checkHydroTelegram(text, this.props.hydroPosts, errors, this.observation, this.state.observationDate)){
      this.setState({errors: errors});
      return;
    }
    this.observation.telegram = text;
    this.props.onFormSubmit({observation: this.observation, observationDate: this.state.observationDate}); //, tlgText: this.state.tlgText});
    this.setState({
      tlgText: this.tlgHead,
      errors: []
    });
  }
  inBufferClick(e){
    this.props.onInBuffer({tlgText: this.state.tlgText, message: this.state.errors[0], tlgType: "hydro"});
    this.setState({errors: []});
  }
  render(){
    let inBuffer = ((this.state.errors[0] > '') && (this.state.tlgText > '')) ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    let obsDate = this.props.inputMode == 'normal' ? this.state.observationDate : <input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required={true} autoComplete="on" />;
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