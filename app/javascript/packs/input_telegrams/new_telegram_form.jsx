import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';
import { checkSynopticTelegram } from './check_synoptic_telegram';
import { checkStormTelegram } from './check_storm_telegram';
import { checkSeaStormTelegram } from './check_sea_storm_telegram';
import { checkAgroStormTelegram } from './check_agro_storm_telegram';
import { checkAgroTelegram } from './check_agro_telegram';
import { checkRadiationTelegram } from './check_radiation_telegram';
import { checkSeaTelegram } from './check_sea_telegram';

export default class NewTelegramForm extends React.Component{
  constructor(props) {
    super(props);
    this.observation = {};
    this.state = {
      codeStation: this.props.codeStation,
      currDate:  this.props.currDate,
      tlgType: this.props.tlgType,
      tlgTerm: this.props.tlgTerm,  
      tlgText: '',
      isMariupol: false,
      errors: [] 
    };
    
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleTypeSelected = this.handleTypeSelected.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.inBufferClick = this.inBufferClick.bind(this);
    this.state.tlgText = this.initText(this.props.tlgType);
    // this.handleFromOgimet = this.handleFromOgimet.bind(this);
  }
  
  initText(tlgType){
    switch (tlgType){
      case 'sea':
        return "МОРЕ =";
      case 'radiation':
        return "ЩЭРБХ "+this.state.codeStation+' =';
      case 'agro_dec':
        return "ЩЭАГУ "+this.state.codeStation+' =';
      case 'agro':
        return "ЩЭАГЯ "+this.state.codeStation+' =';
      case 'synoptic':
        let hdr = '' //this.state.tlgTerm % 2 == 0 ? "ЩЭСМЮ " : "ЩЭСИД ";
        return hdr+this.state.codeStation+' =';
      case 'radiation_daily':
        // let cd = this.state.currDate[3]+this.state.currDate.substr(5,2)+this.state.currDate.substr(8,2); 20190614 Boyko
        // let cd = this.state.currDate.substr(2,2)+this.state.currDate.substr(5,2)+this.state.currDate.substr(8,2); 20190619 Boyko, KMA
        let mm
        switch (+this.state.currDate.substr(5,2)) {
          case 10:
            mm = 0
            break;
          case 11:
            mm = 6
            break
          case 12:
            mm = 7
            break
          default:
            mm = +this.state.currDate.substr(5,2)
            break;
        }
        let cd = this.state.currDate.substr(8,2)+mm+'06'; // ddmmhh 20221025
        return "РХОБ "+this.state.codeStation+' '+cd+' 80000=';
        // return 'ЩЭРДЦ '+this.state.codeStation+' '+cd+' 80000=';
      default:
        return '';
    }
    
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
        const first6 = `${date.substr(-2)}${term}1 `
        if(text.substring(0,6)!=first6)
          text = first6.concat(text)
        if (!checkSynopticTelegram(term, text, errors, this.props.stations, this.observation)){
          this.setState({errors: errors});
          return;
        }
        this.observation.telegram = text;
        this.observation.term = term;
        this.observation.date = date;
        break;
      case 'storm':
        if(text.substr(0,5) == 'ЩЭОЯА' || text.substr(0,5) == 'ЩЭОЯУ'){ // sea storm
          if (!checkSeaStormTelegram(text, this.props.stations, errors, this.observation)){
            this.setState({errors: errors});
            return;
          }
        }else{
          if(text[24] == '2'){ // agro storm
            if (!checkAgroStormTelegram(text, this.props.stations, errors, this.observation)){
              this.setState({errors: errors});
              return;
            }
          }else{
            this.observation.telegram_date = this.state.currDate;
            if (!checkStormTelegram(text, this.props.stations, errors, this.observation)){
              this.setState({errors: errors});
              return;
            }
          }
        }
        break;
      case 'radiation':
      case 'radiation_daily':
        if(!checkRadiationTelegram(text, this.props.stations, errors, this.observation, this.state.currDate)){
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
        if (!checkSeaTelegram(text, this.props.stations, errors, this.observation, this.state.currDate)) {
          this.setState({errors: errors});
          return;
        }
        break;
    }
    this.props.onFormSubmit({observation: this.observation, currDate: date, tlgType: this.state.tlgType, tlgText: this.state.tlgText});
    this.setState({
      tlgText: this.initText(this.props.tlgType),
      isMariupol: false,
      errors: []
    });
    // if([...this.state.tlgText.matchAll(new RegExp('=','gi'))].map(a => a.index).length>1)
    //   alert(this.state.tlgText);
  }
  dateChange(e){
    this.state.currDate = e.target.value;
    this.setState({tlgText: this.initText(this.state.tlgType)});
  }
  handleTypeSelected(value){
    if (this.props.inputMode == 'normal'){
      let t = Math.floor(new Date().getUTCHours() / 3) * 3;
      this.state.tlgTerm = t < 10 ? '0'+t : t;
    }
    this.state.tlgType = value;
    this.props.onTelegramTypeChange(value, this.state.tlgTerm);
    this.setState({tlgType: value, tlgText: this.initText(value), errors: []});
  }  
  handleTermSelected(value){
    this.state.tlgTerm = value;
    this.state.tlgText = this.initText(this.state.tlgType);
    this.setState({errors: []});
  }  
  handleTextChange(e) {
    this.setState({tlgText: e.target.value, errors: []});
  }  
  inBufferClick(e){
    this.props.onInBuffer({tlgText: this.state.tlgText, message: this.state.errors[0], tlgType: this.state.tlgType});
    this.setState({tlgText: this.initText(this.state.tlgType), errors: []});
  }
  // handleFromOgimet(e){
  //   this.props.onGetOgimet({term: this.state.tlgTerm, date: this.state.currDate})
  //   this.setState({isMariupol: true, errors: []})
  // }

  render() {
    const types = [
      { value: 'synoptic',        label: 'Синоптические' },
      { value: 'agro',            label: 'Агро ежедневные' },
      { value: 'agro_dec',        label: 'Агро декадные' },
      { value: 'storm',           label: 'Штормовые' },
      { value: 'radiation',       label: 'Радиация' },
      { value: 'radiation_daily', label: 'Радиация ежедневная' },
      { value: 'sea',             label: 'Морские' },
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
    
    let currValue = '';
    if(this.state.isMariupol && this.props.telegramMariupol){
      this.state.tlgText = this.props.telegramMariupol;
      this.state.isMariupol = false;
    }
    let tlgDate = this.props.inputMode == 'normal' ? <td>{this.state.currDate}</td> : <td><input type="date" name="input-date" value={this.state.currDate} onChange={this.dateChange} required={true} autoComplete="on" /></td>;
    let term = this.state.tlgType == 'synoptic' ? <td>{this.props.inputMode == 'normal' ? this.props.tlgTerm : this.state.tlgTerm}</td> : <td></td>;
    let termSelect = this.state.tlgType == 'synoptic' ? <td><TermSynopticSelect options={terms} onUserInput={this.handleTermSelected} defaultValue={this.state.tlgTerm} readOnly="readonly"/></td> : <td></td>;
    let inBuffer = this.state.errors[0] > '' && this.state.tlgText > '' ? <button style={{float: "right"}} type="button" id="in-buffer" onClick={(event) => this.inBufferClick(event)}>В буфер</button> : '';
    let textButton = this.state.tlgType == 'synoptic' ? 
    <table className="table table-hover">
      <tbody>
        <tr>
          <td width="90%"><input type="text" value={this.state.tlgText} onChange={(event) => this.handleTextChange(event)}/></td>
          {/* <td><input type="button" value="Мариуполь" onClick={this.handleFromOgimet}/></td> */}
        </tr>
      </tbody>
    </table> : <input type="text" value={this.state.tlgText} onChange={(event) => this.handleTextChange(event)}/>
    const rfSignature = `${+this.state.tlgTerm % 2 == 0 ? 'СМРС11':'СИРС11'} AAXX ${this.state.currDate.substr(8,2)}${this.state.tlgTerm}1`
    return (
    <div className="col-md-12">
      <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тип</th>
              {this.state.tlgType == 'synoptic' ? <th>Срок</th> : <th></th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tlgDate}
              <td><TermSynopticSelect options={types} onUserInput={this.handleTypeSelected} defaultValue={this.state.tlgType}/></td>
              {this.props.inputMode == 'normal' ? term : termSelect}
            </tr>
          </tbody>
        </table>
        {this.state.tlgType == 'synoptic' ? <h4>{rfSignature}</h4> : null}
        <div>Текст 
          {textButton}
          <span style={{color: 'red'}}>{this.state.errors[0]}</span>
          {inBuffer}
        </div>
        <input type="submit" value="Сохранить" />
      </form>
    </div>
    );
  }
}