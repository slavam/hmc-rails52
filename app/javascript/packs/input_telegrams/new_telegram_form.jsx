import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';
import { checkSynopticTelegram } from './check_synoptic_telegram';
import { checkStormTelegram } from './check_storm_telegram';
import { checkAgroTelegram } from './check_agro_telegram';
import { checkRadiationTelegram } from './check_radiation_telegram';

export default class NewTelegramForm extends React.Component{
  constructor(props) {
    super(props);
    this.observation = {};
    this.state = {
      // minutes: this.props.minutes,
      currDate:  this.props.currDate,
      tlgType: this.props.tlgType,
      tlgTerm: this.props.tlgTerm,  
      tlgText: '',
      errors: [] 
    };
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleTypeSelected = this.handleTypeSelected.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.inBufferClick = this.inBufferClick.bind(this);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if(this.props.inputMode == 'normal'){
      let d = new Date();
      this.state.currDate = d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);
      if (this.state.tlgType == 'synoptic'){  // mwm 20180619
        let t = Math.floor(d.getUTCHours() / 3) * 3;
        this.state.tlgTerm = t < 10 ? '0'+t : t;
      }
    }
    var term = this.state.tlgTerm;
    var text = this.state.tlgText.replace(/\s+/g, ' '); // one space only
    text = text.trim();
    var date = this.state.currDate;
    var errors = [];
    
    this.state.errors = [];
    if (!text) {
      this.setState({errors: ["Нет текста телеграммы"]});
      return;
    }
    this.observation = {};
    this.observation.telegram = text;
    switch (this.state.tlgType) {
      case 'synoptic':
        if (!checkSynopticTelegram(term, text, errors, this.props.stations, this.observation)){
          this.setState({errors: errors});
          return;
        }
        this.observation.term = term;
        this.observation.date = date;
        break;
      case 'storm':
        if (!checkStormTelegram(text, this.props.stations, errors, this.observation)){
          this.setState({errors: errors});
          return;
        }
        break;
      case 'radiation':
        if(!checkRadiationTelegram(text, this.props.stations, errors, this.observation)){
          this.setState({errors: errors});
          return;
        }
        break;
      case 'agro':
        if (text.substr(0,5) != 'ЩЭАГЯ') {
          this.setState({errors: ["Ошибка в опознавательных буквах"]});
          return;
        }
        if (!checkAgroTelegram(text, this.props.stations, errors, this.observation)) {
          this.setState({errors: errors});
          return;
        }
        break;
      case 'agro_dec':
        if (text.substr(0,5) != 'ЩЭАГУ') {
          this.setState({errors: ["Ошибка в опознавательных буквах"]});
          return;
        }
        if (!checkAgroTelegram(text, this.props.stations, errors, this.observation)) {
          this.setState({errors: errors});
          return;
        }
        break;
      case 'sea':
        this.observation.day_obs = text.substr(5,2);
        this.observation.term = text.substr(7,2);
        break;
    }
    this.props.onFormSubmit({observation: this.observation, currDate: date, tlgType: this.state.tlgType, tlgText: this.state.tlgText});
    this.setState({
      tlgText: '',
      errors: []
    });
  }

  dateChange(e){
    this.setState({currDate: e.target.value});
  }

  handleTypeSelected(value){
    if (this.props.inputMode == 'normal'){
      let t = Math.floor(new Date().getUTCHours() / 3) * 3;
      this.state.tlgTerm = t < 10 ? '0'+t : t;
    }
    this.state.tlgType = value;
    this.props.onTelegramTypeChange(value, this.state.tlgTerm);
    this.setState({tlgType: value, errors: []});
  }
  
  handleTermSelected(value){
    this.setState({tlgTerm: value, errors: []});
  }
  

  handleTextChange(e) {
    this.setState({tlgText: e.target.value, errors: []});
  }
  
  inBufferClick(e){
    this.props.onInBuffer({tlgText: this.state.tlgText, message: this.state.errors[0], tlgType: this.state.tlgType});
    this.setState({tlgText: '', errors: []});
  }

  render() {
    const types = [
      { value: 'synoptic',  label: 'Синоптические' },
      { value: 'agro',      label: 'Агро ежедневные' },
      { value: 'agro_dec',  label: 'Агро декадные' },
      { value: 'storm',     label: 'Штормовые' },
      { value: 'radiation', label: 'Радиация' },
      // { value: 'sea',       label: 'Морские' },
    ];
    const terms = [
      { value: '00', label: '00' },
      { value: '03', label: '03' },
      { value: '06', label: '06' },
      { value: '09', label: '09' },
      { value: '12', label: '12' },
      { value: '15', label: '15' },
      { value: '18', label: '18' },
      { value: '21', label: '21' }
    ];

    let tlgDate = this.props.inputMode == 'normal' ? <td>{this.state.currDate}</td> : <td><input type="date" name="input-date" value={this.state.currDate} onChange={this.dateChange} required="true" autoComplete="on" /></td>;
    let term = this.state.tlgType == 'synoptic' ? <td>{this.props.inputMode == 'normal' ? this.props.tlgTerm : this.state.tlgTerm}</td> : <td></td>;
    let termSelect = this.state.tlgType == 'synoptic' ? <td><TermSynopticSelect options={terms} onUserInput={this.handleTermSelected} defaultValue={this.state.tlgTerm} readOnly="readonly"/></td> : <td></td>;
    let inBuffer = this.state.errors[0] > '' && this.state.tlgText > '' ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    return (
    <div className="col-md-12">
      <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тип</th>
              {this.state.tlgType == 'synoptic' ? <th>Срок</th> : <th></th>}
              {/*<th>Minutes</th>*/}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tlgDate}
              <td><TermSynopticSelect options={types} onUserInput={this.handleTypeSelected} defaultValue={this.state.tlgType}/></td>
              {this.props.inputMode == 'normal' ? term : termSelect}
              {/*<td>{this.props.minutes} props.minutes=>{this.props.minutes} states.minutes=>{this.state.minutes}</td>*/}
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
