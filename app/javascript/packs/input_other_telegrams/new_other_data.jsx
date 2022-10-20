import React from 'react';
import Select from 'react-select';

export default class NewOtherData extends React.Component{
  constructor(props){
    super(props);
    let hour = Math.floor(+this.props.localTime.substr(11) / 3) * 3;
    let st = { value: '1',  label: 'Донецк' }; 
    if(this.props.stationId!=''){
      st.value = this.props.stationId; 
      st.label = this.props.stationName;
    }
    this.state = {
      localDate: this.props.localTime.substr(0, 10),
      localHour: hour < 10 ? '0'+hour : hour, 
      station: st,
      dataType: { value: 'temp',  label: this.props.otherTypes['temp'] },
      value: '',
      observationDate: this.props.currDate,
      message: '',
      point: { value: 'Макеевка',  label: 'Макеевка' },
      period: { value: 'day',  label: 'День' },
      term: { value: '00',  label: '00:00' },
      errors: []
    };
    this.handleTypeSelected = this.handleTypeSelected.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handlePointSelected = this.handlePointSelected.bind(this);
    this.handlePeriodSelected = this.handlePeriodSelected.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
  }
  handleTypeSelected(val){
    this.props.onDataTypeChange(val.value);
    this.setState({dataType: val, errors: []});
  }
  handleStationSelected(val){
    this.setState({station: val});
  }
  handlePointSelected(val){
    this.setState({point: val});
  }
  handlePeriodSelected(val){
    this.setState({period: val});
  }
  handleTermSelected(val){
    this.setState({term: val});
  }
  handleDescriptionChange(e){
    this.setState({message: e.target.value});
  }
  handleValueChange(e){
    this.setState({value: e.target.value, errors: []});  
  }
  dateChange(e){
    this.setState({observationDate: e.target.value, errors: []});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.state.errors = [];
    if (!this.state.value) {
      this.setState({errors: ["Не задано значение"]});
      return;
    }
    switch (this.state.dataType.value) {
      case 'perc': 
        this.observation = {
          data_type: this.state.dataType.value,
          value: this.state.value,
          obs_date: this.state.observationDate,
          source: this.state.point.value,
          period: this.state.period.value,
          description: this.state.message
        };
        break;
      case 'wind':
        this.observation = {
          data_type: this.state.dataType.value,
          value: this.state.value,
          obs_date: this.props.inputMode == 'normal' ? this.state.localDate : this.state.observationDate,
          period: this.props.inputMode == 'normal' ? this.state.localHour : this.state.term.value,
          station_id: this.state.station.value
        };
        break;
      default:
        this.observation = {
          data_type: this.state.dataType.value,
          value: this.state.value,
          obs_date: this.state.observationDate,
          station_id: this.state.station.value
        };
        break;
    }
    this.setState({
      value: '',
      station: (this.props.stationId=='' ? { value: '1',  label: 'Донецк' } : {value: this.props.stationId, label: this.props.stationName}),
      message: '',
      point: { value: 'Макеевка',  label: 'Макеевка' },
      period: { value: 'day',  label: 'День' },
      term: { value: '00',  label: '00:00' },
      errors: []
    });
    this.props.onFormSubmit({other_observation: this.observation});
  }
  
  render(){
    const types = [];
    Object.keys(this.props.otherTypes).forEach( k => types.push({value: k, label: this.props.otherTypes[k]}));
    const stations = [];
    // add Mariupol KMA 20221020
    [1,2,3,10,5].forEach(s => stations.push({value: s, label: this.props.stations[s]}));
    const points = [
      { value: 'Макеевка',  label: 'Макеевка' },
      { value: 'Кировский',  label: 'Кировский' },
      { value: 'Авдотьино',  label: 'Авдотьино' },
      { value: 'Старобешево',  label: 'Старобешево' },
      { value: 'Тельманово',  label: 'Тельманово' },

      { value: 'Раздольное',  label: 'Раздольное' },
      { value: 'Стрюково',  label: 'Стрюково' },
      { value: 'Дмитровка',  label: 'Дмитровка' },
      { value: 'Новоселовка',  label: 'Новоселовка' },
      { value: 'Благодатное',  label: 'Благодатное' },
      { value: 'Алексеево-Орловка',  label: 'Алексеево-Орловка' },
    ];
// Change OtherObservation::POSTS   !!!!!!!!!!!!!!
// Aram 20221020
      // {value: 'Николаевка', label: 'Николаевка'},
      // {value: 'Кременевка', label: 'Кременевка'},
      // {value: 'Захаровка', label: 'Захаровка'},
      // {value: 'Стародубовка', label: 'Стародубовка'},
      // {value: 'Алексеево-Дружковка', label: 'Алексеево-Дружковка'},
      // {value: 'Черкасское', label: 'Черкасское'},
      // {value: 'Северск', label: 'Северск'},
      // {value: 'Торское', label: 'Торское'},
    
    const periods = [
      { value: 'day',  label: 'День' },
      { value: 'night',  label: 'Ночь' }
    ];
    const terms = [
      {value: '00', label: '00:00'},
      {value: '03', label: '03:00'},
      {value: '06', label: '06:00'},
      {value: '09', label: '09:00'},
      {value: '12', label: '12:00'},
      {value: '15', label: '15:00'},
      {value: '18', label: '18:00'},
      {value: '21', label: '21:00'}
    ];
    let obsDate = this.props.inputMode == 'normal' ? <td>{this.state.observationDate}</td> : <td><input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required={true} autoComplete="on" /></td>;
    let hdr = '';
    let dat = '';
    let station;
    if(this.props.stationId==''){
      station = <td><Select value={this.state.station} onChange={this.handleStationSelected} options={stations}/></td>
    }else{
      station = <td>{this.state.station.label}</td>
    }
    if(this.state.dataType.value == 'perc'){
      hdr = <tr><th width="220px">Тип данных</th><th>Дата наблюдения</th><th width="140px">Пост</th><th width="110px">Период</th><th>Дополнение</th><th>Значение</th></tr>;
      dat = <tr>
              <td><Select id='types' options={types} onChange={this.handleTypeSelected} value={this.state.dataType}/></td>
              {obsDate}
              <td><Select id='points' options={points} onChange={this.handlePointSelected} value={this.state.point}/></td>
              <td><Select id='periods' options={periods} onChange={this.handlePeriodSelected} value={this.state.period}/></td>
              <td><input type="text" value={this.state.message} onChange={(event) => this.handleDescriptionChange(event)}/></td>
              <td><input lang="en" step="0.1" type="number" value={this.state.value} onChange={(event) => this.handleValueChange(event)}/></td>
            </tr>;
    }else if(this.state.dataType.value == 'wind'){
      let o_date = obsDate;
      let o_hour = <td>{this.state.localHour}</td>
      if (this.props.inputMode == 'normal')
        o_date = <td>{this.state.localDate}</td>;
      else
        o_hour = <td><Select id='terms' options={terms} onChange={this.handleTermSelected} value={this.state.term}/></td>;
      hdr = <tr><th width="220px">Тип данных</th><th width="140px">Дата наблюдения</th><th>Время</th><th>Метеостанция</th><th>Значение</th></tr>;
      dat = <tr>
              <td><Select id='types' options={types} onChange={this.handleTypeSelected} value={this.state.dataType}/></td>
              {o_date}
              {o_hour}
              {station}
              <td><input type="number" value={this.state.value} onChange={(event) => this.handleValueChange(event)}/></td>
            </tr>;
    }else{
      hdr = <tr><th width="220px">Тип данных</th><th>Дата наблюдения</th><th>Метеостанция</th><th>Значение</th></tr>;
      dat = <tr>
              <td><Select id='types' options={types} onChange={this.handleTypeSelected} value={this.state.dataType}/></td>
              {obsDate}
              {station}
              <td><input type="number" value={this.state.value} onChange={(event) => this.handleValueChange(event)}/></td>    
            </tr>;
    }
    return(
      <div>
        <form className="telegramForm" onSubmit={(event) => this.handleSubmit(event)}>
          <table className="table table-hover">
            <thead>
              {hdr}
            </thead>
            <tbody>
              {dat}
            </tbody>
          </table>
          <p>
            <span style={{color: 'red'}}>{this.state.errors[0]}</span>
          </p>
          <input type="submit" value="Сохранить" />
        </form>
      </div>
    );
  }
}
