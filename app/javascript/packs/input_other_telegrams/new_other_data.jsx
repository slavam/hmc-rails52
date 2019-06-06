import React from 'react';
import Select from 'react-select';

export default class NewOtherData extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      // seconds: 0,
      // localTime: '',
      station: { value: '1',  label: 'Донецк' },
      dataType: { value: 'temp',  label: 'Температура воздуха' },
      value: '',
      observationDate: this.props.currDate,
      message: '',
      point: { value: 'Макеевка',  label: 'Макеевка' },
      period: { value: 'day',  label: 'День' },
      errors: []
    };
    this.handleTypeSelected = this.handleTypeSelected.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handlePointSelected = this.handlePointSelected.bind(this);
    this.handlePeriodSelected = this.handlePeriodSelected.bind(this);
    // this.tick = this.tick.bind(this);
    // this.timer = setInterval(this.tick, 1000);
  }
  
  // tick(){
  //   let d = new Date();
  //   let h = d.getHours();
  //   let lt = (h<10 ? '0'+h : h)+d.toJSON().slice(13,19);
  //   if(this.state.seconds != d.getSeconds()){  
  //     this.setState({seconds: d.getSeconds(), localTime: lt}); //d.toJSON().slice(11,19)});
  //   }
  // }
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
      station: { value: '1',  label: 'Донецк' },
      message: '',
      point: { value: 'Макеевка',  label: 'Макеевка' },
      period: { value: 'day',  label: 'День' },
      errors: []
    });
    this.props.onFormSubmit({other_observation: this.observation});
  }
  
  render(){
    const types = [
      { value: 'temp',  label: 'Температура воздуха' },
      { value: 'perc',  label: 'Осадки' },
      { value: 'min_hum',  label: 'Минимальная влажность' },
      // { value: 'freez',  label: 'Промерзание' },
      // { value: 'rad',  label: 'Радиация' },
    ];
    const stations = [
      { value: '1',  label: 'Донецк' },
      { value: '2',  label: 'Амвросиевка' },
      { value: '3',  label: 'Дебальцево' },
      { value: '10',  label: 'Седово' },
    ];
    const points = [
      { value: 'Макеевка',  label: 'Макеевка' },
      { value: 'Кировский',  label: 'Кировский' },
      { value: 'Авдотьино',  label: 'Авдотьино' },
      { value: 'Старобешево',  label: 'Старобешево' },
      { value: 'Тельманово',  label: 'Тельманово' },
    ];
    const periods = [
      { value: 'day',  label: 'День' },
      { value: 'night',  label: 'Ночь' }
    ];
    let obsDate = this.props.inputMode == 'normal' ? <td>{this.state.observationDate}</td> : <td><input type="date" name="input-date" value={this.state.observationDate} onChange={(event) => this.dateChange(event)} required="true" autoComplete="on" /></td>;
    let hdr = '';
    let dat = '';
    if(this.state.dataType.value == 'perc'){
      hdr = <tr><th width="220px">Тип данных</th><th>Дата наблюдения</th><th width="140px">Пост</th><th width="110px">Период</th><th>Дополнение</th><th>Значение</th></tr>;
      dat = <tr>
              <td><Select id='types' options={types} onChange={this.handleTypeSelected} value={this.state.dataType}/></td>
              {obsDate}
              <td><Select id='points' options={points} onChange={this.handlePointSelected} value={this.state.point}/></td>
              <td><Select id='periods' options={periods} onChange={this.handlePeriodSelected} value={this.state.period}/></td>
              <td><input type="text" value={this.state.message} onChange={(event) => this.handleDescriptionChange(event)}/></td>
              <td><input type="number" value={this.state.value} onChange={(event) => this.handleValueChange(event)}/></td>
            </tr>;
    }else{
      hdr = <tr><th width="220px">Тип данных</th><th>Дата наблюдения</th><th>Метеостанция</th><th>Значение</th></tr>;
      dat = <tr>
              <td><Select id='types' options={types} onChange={this.handleTypeSelected} value={this.state.dataType}/></td>
              {obsDate}
              <td><Select value={this.state.station} onChange={this.handleStationSelected} options={stations}/></td>
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