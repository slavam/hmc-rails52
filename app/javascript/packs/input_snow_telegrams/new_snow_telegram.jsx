import React from 'react';
import { checkSnowTelegram } from './check_snow_telegram';

export default class NewSnowTelegram extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tlgText: '',
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
    this.props.onFormSubmit({observation: this.observation, observationDate: this.state.observationDate, tlgType: this.state.tlgType}); //, tlgText: this.state.tlgText});
    this.setState({
      tlgText: '',
      errors: []
    });
  }
  
  inBufferClick(e){
    this.props.onInBuffer({tlgText: this.state.tlgText, message: this.state.errors[0], tlgType: this.state.tlgType});
    this.setState({tlgText: '', errors: []});
  }
  
  render(){
    let inBuffer = ((this.state.errors[0] > '') && (this.state.tlgText > '')) ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    let obsDate = this.props.inputMode == 'normal' ? <td>{this.state.observationDate}</td> : <td><input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required={true} autoComplete="on" /></td>;
    return(
      <div>
        <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
          <table className="table table-hover">
            <thead>
              <tr>
                {/* <th>Тип телеграммы</th> */}
                <th>Дата наблюдения</th>
                {/* <th>Время местное</th> */}
                {/*<th>Время UTC</th>*/}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* <td><TermSynopticSelect options={types} onUserInput={this.handleTypeSelected} defaultValue={this.state.tlgType}/></td> */}
                {obsDate}
                {/* <td>{this.state.localTime}</td> */}
              </tr>
            </tbody>
          </table>
          <p>Текст 
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