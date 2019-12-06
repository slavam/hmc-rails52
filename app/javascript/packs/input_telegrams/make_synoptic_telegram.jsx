import React from 'react';
import Select from 'react-select';
// import cx from 'classnames';

export default class MakeSynopticTelegram extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tlgText: '', //(+this.props.term % 2) == 0 ? 'ЩЭСМЮ ': 'ЩЭСИД ', //this.formText(), //this.props.tlgText,
      // termR: {value: 0, label: '00'},
      stationR: {value: 34519, label: "Донецк"},
      factorGr6R: {value: '4', label: 'Не включена: количество осадков не измерялось'},
      factorGr7R: {value: '2', label: 'Не включена: нет явлений, подлежащих передаче'},
      cloudHeightR: {value: '/',label: "Нижняя граница не определенна"}, 
      visibilityR: {value: '//',label: "Видимость не определена"},
      cloudAmountR: {value: '/',label:'Определить невозможно или наблюдения не производились'},
      windDirectionR: {value: '//',label: "Данные отсутствуют"},
      windSpeed: null, //'//',
      temperature: 0,
      dewPoint: 0,
      pressureStation: null,
      pressureSea: 0,
      isAnemometer: false
    };
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleStationChange = this.handleStationChange.bind(this);
    this.handleFactorGr6Change = this.handleFactorGr6Change.bind(this);
    this.handleFactorGr7Change = this.handleFactorGr7Change.bind(this);
    this.handleCloudHeightChange = this.handleCloudHeightChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleCloudAmountChange = this.handleCloudAmountChange.bind(this);
    this.handleWindDirectionChange = this.handleWindDirectionChange.bind(this);
    // this.handleWindSpeedChange = this.handleWindSpeedChange.bind(this);
    // this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
    this.state.tlgText = this.formText();
  }
  handlePressureSeaChange(e){
    this.state.pressureSea = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handlePressureStationChange(e){
    this.state.pressureStation = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleDewPointChange(e){
    this.state.dewPoint = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleTemperatureChange(e){
    this.state.temperature = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleWindSpeedChange(e){
    if(+e.target.value>99)
      e.target.value = 99;
    this.state.windSpeed = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  isAnemometerChange(e){
    this.state.windDirectionR = {value: '//',label:"Данные отсутствуют"};
    this.setState({isAnemometer: e.target.checked});
    this.setState({tlgText: this.formText()});
  }
  handleTermChange(val){
    this.setState({termR: val});
  }
  handleStationChange(val){
    this.state.stationR = val;
    this.setState({tlgText: this.formText()});
  }
  handleFactorGr6Change(val){
    this.state.factorGr6R = val;
    this.setState({tlgText: this.formText()});
  }
  handleFactorGr7Change(val){
    this.state.factorGr7R = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudHeightChange(val){
    this.state.cloudHeightR = val;
    this.setState({tlgText: this.formText()});
  }
  handleVisibilityChange(val){
    this.state.visibilityR = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudAmountChange(val){
    this.state.cloudAmountR = val; 
    this.setState({tlgText: this.formText()});
  }
  handleWindDirectionChange(val){
    this.state.windDirectionR = val;
    this.setState({tlgText: this.formText()});
  }
  formText(){
    let wSpeed = (this.state.windSpeed ? (this.state.windSpeed<10 ? ('0'+(+this.state.windSpeed)) : (+this.state.windSpeed)) : '//') +' ';
    let temperature = '1'+(this.state.temperature<0? '1'+('00'+this.state.temperature*(-10)).substr(-3):'0'+('00'+this.state.temperature*(10)).substr(-3))+' ';
    let dewPoint = '2'+(this.state.dewPoint<0? '1'+('00'+this.state.dewPoint*(-10)).substr(-3):'0'+('00'+this.state.dewPoint*(10)).substr(-3))+' ';
    let pressureStation = (this.state.pressureStation ? '3'+('000'+this.state.pressureStation*10).substr(-4)+' ' : '');
    let pressureSea = '4'+('000'+this.state.pressureSea*10).substr(-4)+' ';
    return ((+this.props.term % 2) == 0 ? 'ЩЭСМЮ ': 'ЩЭСИД ')+
      this.state.stationR.value+' '+
      this.state.factorGr6R.value+
      this.state.factorGr7R.value+
      this.state.cloudHeightR.value+
      this.state.visibilityR.value+' '+
      this.state.cloudAmountR.value+
      this.state.windDirectionR.value+
      wSpeed+
      temperature+
      dewPoint+
      pressureStation+
      pressureSea+
      (this.state.factorGr6R.value == '1'? '6RRRt ': '')+
      (this.state.factorGr7R.value == '1'? '7wwWW ': '')+
      (this.state.factorGr6R.value == '/'? '555 ': '')+
      (this.state.factorGr6R.value == '/'? '6RRRt ': '')+
      '=';
  }
  render(){
    const terms = [];
    for(let i=0; i<8; i++){
      terms.push({value: i*3, label: i*3<10 ? '0'+i*3 : i*3});
    }
    const stations = [];
    this.props.stations.forEach((s) => {
      stations.push({value: s.code, label: s.name});
    });
    const gr6Factors = [
      // {value: '0', label: 'Включена в разделах 1 и 3'},
      {value: '1', label: 'Включена в разделе 1'},
      // {value: '2', label: 'Включена в разделе 3'},
      {value: '3', label: 'Не включена: осадков не было'},
      {value: '4', label: 'Не включена: количество осадков не измерялось'},
      {value: '/', label: 'Включена в разделе 5'},
    ];
    const gr7Factors = [
      {value: '1',label: 'Включена'},
      {value: '2',label: 'Не включена: нет явлений, подлежащих передаче'},
      {value: '3',label: 'Не включена: нет данных (наблюдения не проводились)'}
    ];
    const cloudHeights = [
      {value: '0',label: "< 50"},
      {value: '1',label: "50-100"},
      {value: '2',label: "100-200"},
      {value: '3',label: "200-300"},
      {value: '4',label: "300-600"},
      {value: '5',label: "600-1000"},
      {value: '6',label: "1000-1500"},
      {value: '7',label: "1500-2000"},
      {value: '8',label: "2000-2500"},
      {value: '9',label: "> 2500 или облаков нет"},
      {value: '/',label: "Нижняя граница не определенна"}
    ];
    const visibilities = [
      {value: '90',label: "< 0,05"},
      {value: '91',label: "0,05"},
      {value: '92',label: "0,2"},
      {value: '93',label: "0,5"},
      {value: '94',label: "1"},
      {value: '95',label: "2"},
      {value: '96',label: "4"},
      {value: '97',label: "10"},
      {value: '98',label: "20"},
      {value: '99',label: ">= 50"},
      {value: '//',label: "Видимость не определена"}
    ];
    const cloudAmount = [
      {value: '0',label:"0 (облаков нет)"},
      {value: '1',label:'<=1 (но не 0)'},
      {value: '2',label:'2-3'},
      {value: '3',label:'4'},
      {value: '4',label:'5'},
      {value: '5',label:'6'},
      {value: '6',label:'7-8'},
      {value: '7',label:'>= 9 (но не 10, есть просветы)'},
      {value: '8',label:'10 (без просветов)'},
      {value: '9',label:'Определить невозможно (затруднена видимость)'},
      {value: '/',label:'Определить невозможно или наблюдения не производились'}
    ];
    const windDirections = [
      {value: '00',label:"Штиль"},
      {value: '02',label:"Северо-северо-восточное"},
      {value: '05',label:"Северо-восточное"},
      {value: '07',label:"Восточно-северо-восточное"},
      {value: '09',label:"Восточное"},
      {value: '11',label:"Восточно-юго-восточное"},
      {value: '14',label:"Юго-восточное"},
      {value: '16',label:"Юго-юго-восточное"},
      {value: '18',label:"Южное"},
      {value: '20',label:"Юго-юго-западное"},
      {value: '23',label:"Юго-западное"},
      {value: '25',label:"Западно-юго-западное"},
      {value: '27',label:"Западное"},
      {value: '29',label:"Западно-северо-западное"},
      {value: '32',label:"Северо-западное"},
      {value: '34',label:"Северо-северо-западное"},
      {value: '36',label:"Северное"},
      {value: '99',label:"Переменное"},
      {value: '//',label:"Данные отсутствуют"}
    ];
    const rumbometerWindDirections = [
      {value: '00',label:"Штиль"},
    ];
    let k = '';
    let v = '';
    for(let i=1; i<37; i++){
      k = i<10? '0'+i : i;
      v = (i*10-5)+'-'+(i*10+4);
      rumbometerWindDirections.push({value: k,label:v});
    }
    rumbometerWindDirections.push({value: '99',label:"Переменное"});
    rumbometerWindDirections.push({value: '//',label:"Данные отсутствуют"});
    // let windDirectionControl = 
    //   <Select id="wind-direction" value={this.state.windDirectionR} onChange={this.handleWindDirectionChange} options={windDirections}/>;
    
    // if(this.state.isAnemometer)
    //   windDirectionControl = <p>Anemometer</p>;
    return(
      <div>
        <label htmlFor="tlg-text">Текст телеграммы</label>
        <input id="tlg-text" type="text" value={this.state.tlgText} readOnly={true} />
        {/*<br/>
        <label htmlFor="observation-date">Дата наблюдения</label>
        <input id="observation-date" type="date" value={this.state.observationDate} onChange={(event) => this.handleDateChange(event)}/>
        <label htmlFor="term">Срок</label>
        <Select id="term" value={this.state.termR} onChange={this.handleTermChange} options={terms}/>*/}
        <table className = "table table-bordered">
          <thead>
            <tr>
              <th width="40%"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Метеостанция</th>
              <td><Select id="station" value={this.state.stationR} onChange={this.handleStationChange} options={stations}/></td>
            </tr>
            <tr>
              <th>Признак наличия группы 6 i<sub>R</sub></th>
              <td><Select id="gr6f" value={this.state.factorGr6R} onChange={this.handleFactorGr6Change} options={gr6Factors}/></td>
            </tr>
            <tr>
              <th>Признак наличия группы 7 i<sub>X</sub></th>
              <td><Select id="gr7f" value={this.state.factorGr7R} onChange={this.handleFactorGr7Change} options={gr7Factors}/></td>
            </tr>
            <tr>
              <th>Высота нижней границы самой низкой облачности h (м)</th>
              <td><Select id="h-cloud" value={this.state.cloudHeightR} onChange={this.handleCloudHeightChange} options={cloudHeights}/></td>
            </tr>
            <tr>
              <th>Метеорологическая дальность видимости VV (км)</th>
              <td><Select id="visibility" value={this.state.visibilityR} onChange={this.handleVisibilityChange} options={visibilities}/></td>
            </tr>
            <tr>
              <th>Общее количество облаков всех ярусов N (баллы)</th>
              <td><Select id="cloud-amount" value={this.state.cloudAmountR} onChange={this.handleCloudAmountChange} options={cloudAmount}/></td>
            </tr>
            <tr>
              <th>Направление ветра в срок наблюдения dd
                <input id="scales" type="checkbox" checked={this.state.isAnemometer} onChange={(event) => this.isAnemometerChange(event)} />
                <label htmlFor="scales">По румбометру</label>
              </th>
              <td>
                <Select id="wind-direction" value={this.state.windDirectionR} onChange={this.handleWindDirectionChange} options={this.state.isAnemometer ? rumbometerWindDirections : windDirections}/>
              </td>
            </tr>
            <tr>
              <th>Средняя за срок наблюдения скорость ветра ff (м/сек)</th>
              <td><input type='number' value={this.state.windSpeed} min='0' max='99' onChange={(event) => this.handleWindSpeedChange(event)} /> </td>
            </tr>
            <tr>
              <th>Температура воздуха TTT (°C)</th>
              <td><input type='number' value={this.state.temperature} min='-50' max='60' step="0.1" onChange={(event) => this.handleTemperatureChange(event)} /> </td>
            </tr>
            <tr>
              <th>Температура точки росы T<sub>d</sub>T<sub>d</sub>T<sub>d</sub> (°C)</th>
              <td><input type='number' value={this.state.dewPoint} min='-50' max='60' step="0.1" onChange={(event) => this.handleDewPointChange(event)} /> </td>
            </tr>
            <tr>
              <th>Давление воздуха на уровне станции P<sub>0</sub>P<sub>0</sub>P<sub>0</sub>P<sub>0</sub> (hPa)</th>
              <td><input type='number' value={this.state.pressureStation} min='0' max='2000' step='0.1'  onChange={(event) => this.handlePressureStationChange(event)} /> </td>
            </tr>
            <tr>
              <th>Давление воздуха, приведенное к уровню моря PPPP (hPa)</th>
              <td><input type='number' value={this.state.pressureSea} min='0' max='2000' step='0.1'  onChange={(event) => this.handlePressureSeaChange(event)} /> </td>
            </tr>
          </tbody>
        </table>
        <label htmlFor="tlg-text2">Текст телеграммы</label>
        <input id="tlg-text2" type="text" value={this.state.tlgText} readOnly={true} />
      </div>
    );
  }
}
