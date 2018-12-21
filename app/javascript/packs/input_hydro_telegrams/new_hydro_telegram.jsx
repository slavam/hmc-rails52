import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';
import { checkHydroTelegram } from './check_hydro_telegram';

export default class NewHydroTelegram extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      seconds: 0,
      localTime: '',
      tlgText: '',
      tlgType: this.props.tlgType,
      observationDate: this.props.observationDate,
      errors: []
    };
    this.tick = this.tick.bind(this);
    this.timer = setInterval(this.tick, 1000);
  }
  
  tick(){
    let d = new Date();
    if(this.state.seconds != d.getSeconds()){  
      this.setState({seconds: d.getSeconds(), localTime: d.toJSON().slice(11,19)});
    }
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

    this.state.errors = [];
    if (!text) {
      this.setState({errors: ["Нет текста телеграммы"]});
      return;
    }
    this.observation = {};
    
    switch (this.state.tlgType) {
      case 'hydro': 
        if (!checkHydroTelegram(text, this.props.hydroPosts, this.state.errors, this.observation, this.state.observationDate)) 
          return;
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
    const types = [
      { value: 'hydro',  label: 'Гидрологические' },
      // { value: 'hydro_snow',      label: 'Снегосъемка' },
    ];
    let inBuffer = this.state.errors[0] > '' && this.state.tlgText > '' ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    let obsDate = this.props.inputMode == 'normal' ? <td>{this.state.observationDate}</td> : <td><input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required="true" autoComplete="on" /></td>;
    return(
      <div>
        <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Тип телеграммы</th>
                <th>Дата наблюдения</th>
                <th>Время местное</th>
                {/*<th>Время UTC</th>*/}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><TermSynopticSelect options={types} onUserInput={this.handleTypeSelected} defaultValue={this.state.tlgType}/></td>
                {obsDate}
                <td>{this.state.localTime}</td>
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