import React from 'react';
import Select from 'react-select';

export default class MakeSynopticTelegram extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tlgText: '', //(+this.props.term % 2) == 0 ? 'ЩЭСМЮ ': 'ЩЭСИД ', //this.formText(), //this.props.tlgText,
      stationR: {value: 34519, label: "Донецк"},
      factorGr6R: {value: '4', label: 'Не включена: количество осадков не измерялось'},
      factorGr7R: {value: '2', label: 'Не включена: нет явлений, подлежащих передаче'},
      cloudHeightR: {value: '/',label: "Нижняя граница не определенна"}, 
      visibilityR: {value: '//',label: "Видимость не определена"},
      cloudAmountR: {value: '/',label:'Определить невозможно или наблюдения не производились'},
      windDirectionR: {value: '//',label: "Данные отсутствуют"},
      windSpeed: 0, 
      temperature: 0,
      dewPoint: 0,
      pressureStation: 0, 
      pressureSea: 0,
      baricTrendR: {value: 0,label:"Рост, затем падение"},
      baricTrendValue: 0,
      rainfall: 0,
      rainfallCode: '000',
      rainfallTimeR: {value: '1',label:"6"},
      weatherInTermR: {value: '00', label: "Изменение количества облаков в последний час неизвестно"},
      weatherPast1R: {value:0, label:"Количество облаков <= 5 баллов, ясно"},
      weatherPast2R: {value:0, label:"Количество облаков <= 5 баллов, ясно"},
      cloudTotalR: {value:'/',label:'Наблюдения не производились'},
      cloudCLR: {value:'/',label:'Облака не видны из-за темноты, тумана или других подобных явлений'},
      cloudCMR: {value:'/',label:'Облака не видны из-за темноты, тумана или других подобных явлений'},
      cloudCHR: {value:'/',label:'Облака не видны из-за темноты, тумана или других подобных явлений'},
      temperatureMax: 0,
      temperatureMin: 0,
      soilSnowR: {value:'/',label:'Нельзя определить'},
      
      isAnemometer: false,
      less1mm: false,
      isGroup8: false,
      isSection3: false,
      isGroup31: false,
      isGroup32:false,
      isGroup34:false
    };
    // this.myListeners =[
    //   this.handleStationChange,
    //   this.handleFactorGr6Change,
    //   this.handleFactorGr7Change(),
    //   this.handleCloudHeightChange(),
    //   this.handleVisibilityChange(), 
    //   this.handleCloudAmountChange(),
    //   this.handleWindDirectionChange(),
    //   this.handleBaricTrendChange(),
    //   this.handleRainfallTimeChange(), 
    //   this.handleWeatherInTermChange(),
    //   this.handleWeatherPast1Change(),
    //   this.handleWeatherPast2Change(),
    //   this.handleCloudTotalChange(),
    //   this.handleCloudCLChange(),
    //   this.handleCloudCMChange(),
    //   this.handleCloudCHChange()
    // ];
    // this.myListeners.forEach((l) => l = l.bind(this));
    this.handleStationChange = this.handleStationChange.bind(this);
    this.handleFactorGr6Change = this.handleFactorGr6Change.bind(this);
    this.handleFactorGr7Change = this.handleFactorGr7Change.bind(this);
    this.handleCloudHeightChange = this.handleCloudHeightChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleCloudAmountChange = this.handleCloudAmountChange.bind(this);
    this.handleWindDirectionChange = this.handleWindDirectionChange.bind(this);
    this.handleBaricTrendChange = this.handleBaricTrendChange.bind(this);
    this.handleRainfallTimeChange = this.handleRainfallTimeChange.bind(this);
    this.handleWeatherInTermChange = this.handleWeatherInTermChange.bind(this);
    this.handleWeatherPast1Change= this.handleWeatherPast1Change.bind(this);
    this.handleWeatherPast2Change= this.handleWeatherPast2Change.bind(this);
    this.handleCloudTotalChange=this.handleCloudTotalChange.bind(this);
    this.handleCloudCLChange=this.handleCloudCLChange.bind(this);
    this.handleCloudCMChange=this.handleCloudCMChange.bind(this);
    this.handleCloudCHChange=this.handleCloudCHChange.bind(this);
    this.handleSoilSnowChange=this.handleSoilSnowChange.bind(this);
    
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
  less1mmChange(e){
    this.state.rainfall = 0;
    this.state.rainfallCode = e.target.checked ? '990':'000';
    this.setState({less1mm: e.target.checked});
    this.setState({tlgText: this.formText()});
  }
  isGroup8Change(e){
    this.state.isGroup8 = e.target.checked;
    this.setState({tlgText: this.formText()});
  }
  isSection3Change(e){
    this.state.isSection3 = e.target.checked;
    this.setState({tlgText: this.formText()});
  }
  isGroup31Change(e){
    this.state.isGroup31 = e.target.checked;
    this.setState({tlgText: this.formText()});
  }
  isGroup32Change(e){
    this.state.isGroup32 = e.target.checked;
    this.setState({tlgText: this.formText()});
  }
  isGroup34Change(e){
    this.state.isGroup34 = e.target.checked;
    this.setState({tlgText: this.formText()});
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
  handleBaricTrendChange(val){
    this.state.baricTrendR = val;
    this.setState({tlgText: this.formText()});
  }
  handleBTValueChange(e){
    this.state.baricTrendValue = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleRainfallChange(e){
    this.state.rainfall = e.target.value;
    // if(+e.target.value>=1)
    if(this.state.less1mm)
      this.state.rainfallCode = 990+(+e.target.value*10);
    else
      this.state.rainfallCode = ('00'+e.target.value).substr(-3);
    this.setState({tlgText: this.formText()});
  }
  handleRainfallTimeChange(val){
    this.state.rainfallTimeR = val;
    this.setState({tlgText: this.formText()});
  }
  handleWeatherInTermChange(val){
    this.state.weatherInTermR = val;
    this.setState({tlgText: this.formText()});
  }
  handleWeatherPast1Change(val){
    this.state.weatherPast1R = val;
    this.setState({tlgText: this.formText()});
  }
  handleWeatherPast2Change(val){
    this.state.weatherPast2R = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudTotalChange(val){
    this.state.cloudTotalR = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudCLChange(val){
    this.state.cloudCLR = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudCMChange(val){
    this.state.cloudCMR = val;
    this.setState({tlgText: this.formText()});
  }
  handleCloudCHChange(val){
    this.state.cloudCHR = val;
    this.setState({tlgText: this.formText()});
  }
  handleTemperatureMaxChange(e){
    this.state.temperatureMax = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleTemperatureMinChange(e){
    this.state.temperatureMin = e.target.value;
    this.setState({tlgText: this.formText()});
  }
  handleSoilSnowChange(val){
    this.state.soilSnowR = val;
    this.setState({tlgText: this.formText()});
  }
  formText(){
    let wSpeed = (this.state.windSpeed ? (this.state.windSpeed<10 ? ('0'+(+this.state.windSpeed)) : (+this.state.windSpeed)) : '//') +' ';
    let temperature = '1'+(this.state.temperature<0? '1'+('00'+this.state.temperature*(-10)).substr(-3):'0'+('00'+this.state.temperature*(10)).substr(-3))+' ';
    let dewPoint = '2'+(this.state.dewPoint<0? '1'+('00'+this.state.dewPoint*(-10)).substr(-3):'0'+('00'+this.state.dewPoint*(10)).substr(-3))+' ';
    let pressureStation = (this.state.pressureStation ? '3'+('000'+this.state.pressureStation*10).substr(-4)+' ' : '');
    let pressureSea = '4'+('000'+this.state.pressureSea*10).substr(-4)+' ';
    let valueBT = ('00'+this.state.baricTrendValue*10).substr(-3)+' ';
    let rainfall = '6'+this.state.rainfallCode+this.state.rainfallTimeR.value+' ';
    let weatherInTerm = '7'+this.state.weatherInTermR.value+this.state.weatherPast1R.value+this.state.weatherPast2R.value+' ';
    let cloudNumber = '8'+this.state.cloudTotalR.value+this.state.cloudCLR.value+this.state.cloudCMR.value+this.state.cloudCHR.value+' ';
    let temperatureMax = '1'+(this.state.temperatureMax<0? '1'+('00'+this.state.temperatureMax*(-10)).substr(-3):'0'+('00'+this.state.temperatureMax*(10)).substr(-3))+' ';
    let temperatureMin = '2'+(this.state.temperatureMin<0? '1'+('00'+this.state.temperatureMin*(-10)).substr(-3):'0'+('00'+this.state.temperatureMin*(10)).substr(-3))+' ';
    let soilSnow = '4'+(this.state.soilSnowR.value)+'___ ';
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
      '5'+this.state.baricTrendR.value+
      valueBT+
      (this.state.factorGr6R.value == '1'? rainfall : '')+
      (this.state.factorGr7R.value == '1'? weatherInTerm : '')+
      (this.state.factorGr6R.value == '/'? '555 ': '')+
      (this.state.factorGr6R.value == '/'? '6RRRt ': '')+
      (this.state.isGroup8 ? cloudNumber:'')+
      ((this.state.isSection3 && (this.state.isGroup31 || this.state.isGroup32 || this.state.isGroup34))? '333 ':'')+
      ((this.state.isSection3 && this.state.isGroup31)? temperatureMax:'')+
      ((this.state.isSection3 && this.state.isGroup32)? temperatureMin:'')+
      ((this.state.isSection3 && this.state.isGroup34)? soilSnow:'')+
      '=';
  }
  render(){
    // const terms = [];
    // for(let i=0; i<8; i++){
    //   terms.push({value: i*3, label: i*3<10 ? '0'+i*3 : i*3});
    // }
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
    const baricTrends = [
      {value: 0,label:"Рост, затем падение"},
      {value: 1,label:"Рост затем без изменений или более слабый рост"},
      {value: 2,label:"Рост (равномерный или неравномерный)"},
      {value: 3,label:"Падение или ровный ход, затем рост; или рост, затем более быстрый рост"},
      {value: 4,label:"Ровный или неровный ход"},
      {value: 5,label:"Падение, затем рост"},
      {value: 6,label:"Падение, затем без изменений или слабое падение"},
      {value: 7,label:"Падение"},
      {value: 8,label:"Ровный ход или рост, затем падение; или падение, затем более быстрое падение"}
    ];
    const rainfallTimes = [];
    for(let i=1; i<5; i++){
      rainfallTimes.push({value: i,label:i*6});
    }
    const weatherInTerms = [];
    this.props.weatherInTerm.forEach((w,i) => {
      let k = (i<10 ? ('0'+i):i);
      weatherInTerms.push({value: k, label: w});
    });
    const weatherPasts = [];
    this.props.weatherPast.forEach((w,i) => {
      weatherPasts.push({value:i,label:w});
    });
    const cloudTotals = [
      {value:'0',label:"0 (облаков нет)"},
      {value:'1',label:'<=1 (но не 0)'},
      {value:'2',label:'2-3'},
      {value:'3',label:'4'},
      {value:'4',label:'5'},
      {value:'5',label:'6'},
      {value:'6',label:'7-8'},
      {value:'7',label:'>= 9 (но не 10, есть просветы)'},
      {value:'8',label:'10 (без просветов)'},
      {value:'9',label:'Определить невозможно (затруднена видимость)'},
      {value:'/',label:'Наблюдения не производились'}
    ];
    const cloudCL = [
      {value:'0',label:'Облаков нет'},
      {value:'1',label:'Кучевые плоские и/или кучевые разорванные'},
      {value:'2',label:'Кучевые средние или мощные или вместе с кучевыми разорванными, или с кучевыми плоскими. Основания расположены на одном уровне'},
      {value:'3',label:'Кучево-дождевые лысые с кучевыми, слоисто-кучевыми или слоистыми'},
      {value:'4',label:'Слоисто-кучевые, образовавшиеся из кучевых'},
      {value:'5',label:'Слоисто-кучевые, образовавшиеся не из кучевых'},
      {value:'6',label:'Слоистые туманообразные и/или слоистые разорванные'},
      {value:'7',label:'Слоистые разорванные или кучевые разорванные'},
      {value:'8',label:'Кучевые и слоисто-кучевые. Основания расположены на разных уровнях'},
      {value:'9',label:'Кучево-дождевые волокнистые'},
      {value:'/',label:'Облака не видны из-за темноты, тумана или других подобных явлений'},
    ];
    const cloudCM = [
      {value:'0',label:'Облаков нет'},
      {value:'1',label:'Высокослоистые просвечивающие'},
      {value:'2',label:'Высокослоистые непросвечивающие или слоисто-дождевые'},
      {value:'3',label:'Высококучевые просвечивающие, расположенные на одном уровне'},
      {value:'4',label:'Клочья высококучевых просвечивающих, непрерывно изменяющихся'},
      {value:'5',label:'Высококучевые просвечивающие, полосами'},
      {value:'6',label:'Высококучевые, образовавшиеся из кучевых'},
      {value:'7',label:'Высококучевые, просвечивающие либо высококучевые с высокослоистыми или слоисто-дождевыми'},
      {value:'8',label:'Высококучевые башенкообразные или хлопьевидные'},
      {value:'9',label:'Высококучевые при хаотическом виде неба'},
      {value:'/',label:'Облака CM не видны из-за темноты, тумана и других подобных явлений'},
    ];
    const cloudCH = [
      {value:'0',label:'Облаков нет'},
      {value:'1',label:'Перистые нитевидные, иногда когтевидные'},
      {value:'2',label:'Перистые плотные в виде клочьев или хлопьевидные '},
      {value:'3',label:'Перистые плотные, образовавшиеся от кучево-дождевых'},
      {value:'4',label:'Перистые когтевидные или нитевидные распространяющиеся по небу'},
      {value:'5',label:'Перистые и перисто-слоистые распространяющиеся по небу и в целом обычно уплотняющиеся'},
      {value:'6',label:'Перистые и перисто-слоистые распространяющиеся по небу и в целом обычно уплотняющиеся; сплошная пелена, поднимающаяся над горизонтом выше 45°'},
      {value:'7',label:'Перисто-слоистые, покрывающие все небо'},
      {value:'8',label:'Перисто-слоистые, не распространяющиеся по небу и не покрывающие его полностью'},
      {value:'9',label:'Перисто-кучевые одни или перисто-кучевые'},
      {value:'/',label:'Облака не видны из-за темноты, тумана или вследствие сплошного слоя более низких облаков'},
    ];
    const soilSnow = [
      {value:'0',label:'Поверхность почвы преимущественно покрыта льдом'},
      {value:'1',label:'Слежавшийся или мокрый снег (со льдом или без него), покрывающий менее половины поверхности почвы'},
      {value:'2',label:'Слежавшийся или мокрый снег (со льдом или без него), покрывающий по крайней мере половину поверхности почвы'},
      {value:'3',label:'Ровный слой слежавшегося или мокрого снега покрывает поверхность почвы полностью'},
      {value:'4',label:'Неровный слой слежавшегося или мокрого снега покрывает почву полностью'},
      {value:'5',label:'Сухой рассыпчатый снег покрывает меньше половины поверхности почвы'},
      {value:'6',label:'Сухой рассыпчатый снег покрывает по крайней мере половину поверхности почвы'},
      {value:'7',label:'Ровный слой сухого рассыпчатого снега покрывает поверхность почвы полностью'},
      {value:'8',label:'Неровный слой сухого рассыпчатого снега покрывает поверхность почвы полностью'},
      {value:'9',label:' Снег покрывает поверхность почвы полностью; глубокие сугробы'},
      {value:'/',label:'Нельзя определить'},
    ];
    let group6RRR=null;
    let group6tR=null;
    let rfValue;
    if(this.state.factorGr6R.value == '1'){
      if(this.state.less1mm)
        rfValue=<td><input type='number' value={this.state.rainfall} min='0' max='0.9' step="0.1" onChange={(event) => this.handleRainfallChange(event)}/></td>;
      else
        rfValue=<td><input type='number' value={this.state.rainfall} min='0' max='989' onChange={(event) => this.handleRainfallChange(event)}/></td>;
      group6RRR=
        <tr>
          <th>Количество осадков RRR (мм)
            <table>
              <tbody>
                <tr>
                  <td width="20%"><input id="cb-rainfall" type="checkbox" checked={this.state.less1mm} onChange={(event) => this.less1mmChange(event)}/></td>
                  <td><label htmlFor="cb-rainfall" >До 1 миллиметра</label></td>
                </tr>
              </tbody>
            </table>
          </th>
          {rfValue}
        </tr>;
      group6tR=
        <tr>
          <th>Период времени, за который измерено количество осадков t<sub>R</sub> (час)</th>
          <td><Select id="rf-time" value={this.state.rainfallTimeR} onChange={this.handleRainfallTimeChange} options={rainfallTimes}/></td>
        </tr>;
    }
    let group7ww = null;
    let group7W1 = null;
    let group7W2 = null;
    if(this.state.factorGr7R.value == '1'){
      group7ww=
        <tr>
          <th>Текущая погода ww</th>
          <td><Select id="weather-in-term" value={this.state.weatherInTermR} onChange={this.handleWeatherInTermChange} options={weatherInTerms}/></td>
        </tr>;
      group7W1=
        <tr>
          <th>Прошедшая погода W<sub>1</sub></th>
          <td><Select id="weather-past" value={this.state.weatherPast1R} onChange={this.handleWeatherPast1Change} options={weatherPasts}/></td>
        </tr>;
      group7W2=
        <tr>
          <th>Прошедшая погода W<sub>2</sub></th>
          <td><Select id="weather-past2" value={this.state.weatherPast2R} onChange={this.handleWeatherPast2Change} options={weatherPasts}/></td>
        </tr>;
    }
    let group8N = null;
    let group8CL = null;
    let group8CM = null;
    let group8CH = null;
    if(this.state.isGroup8){
      group8N=
        <tr>
          <th>Общее количество облаков всех ярусов N</th>
          <td><Select id="n-cloud-total" value={this.state.cloudTotalR} onChange={this.handleCloudTotalChange} options={cloudTotals}/></td>
        </tr>;
      group8CL=
        <tr>
          <th>Облака вертикального развития и облака нижнего яруса C<sub>L</sub></th>
          <td><Select id="cloud-cl" value={this.state.cloudCLR} onChange={this.handleCloudCLChange} options={cloudCL}/></td>
        </tr>;
      group8CM=
        <tr>
          <th>Облака среднего яруса и слоисто-дождевые облака C<sub>M</sub></th>
          <td><Select id="cloud-cm" value={this.state.cloudCMR} onChange={this.handleCloudCMChange} options={cloudCM}/></td>
        </tr>;
      group8CH=
        <tr>
          <th>Облака верхнего яруса C<sub>H</sub></th>
          <td><Select id="cloud-ch" value={this.state.cloudCHR} onChange={this.handleCloudCHChange} options={cloudCH}/></td>
        </tr>;
    }
    let section31 = null;
    let group31 = null;
    if(this.state.isSection3){
      section31 =
        <tr>
          <th>
            <table >
              <tbody>
                <tr>
                  <td width="20%"><input id="cb-group31" type="checkbox" checked={this.state.isGroup31} onChange={(event) => this.isGroup31Change(event)}/></td>
                  <td ><label htmlFor="cb-group31" >Включить группу 1 раздела 3</label></td>
                </tr>
              </tbody>
            </table>
          </th>
          <td></td>
        </tr>;
    }
    if(this.state.isSection3 && this.state.isGroup31){
      group31 = 
        <tr>
          <th>Максимальная температура воздуха за день T<sub>x</sub>T<sub>x</sub>T<sub>x</sub> (°C)</th>
          <td><input type='number' value={this.state.temperatureMax} min='-50' max='60' step="0.1" onChange={(event) => this.handleTemperatureMaxChange(event)} /> </td>
        </tr>;
    }
    let section32 = null;
    let group32 = null;
    if(this.state.isSection3){
      section32 =
        <tr>
          <th>
            <table >
              <tbody>
                <tr>
                  <td width="20%"><input id="cb-group32" type="checkbox" checked={this.state.isGroup32} onChange={(event) => this.isGroup32Change(event)}/></td>
                  <td ><label htmlFor="cb-group32" >Включить группу 2 раздела 3</label></td>
                </tr>
              </tbody>
            </table>
          </th>
          <td></td>
        </tr>;
    }
    if(this.state.isSection3 && this.state.isGroup32){
      group32 = 
        <tr>
          <th>Минимальная температура воздуха за ночь T<sub>n</sub>T<sub>n</sub>T<sub>n</sub> (°C)</th>
          <td><input type='number' value={this.state.temperatureMin} min='-50' max='60' step="0.1" onChange={(event) => this.handleTemperatureMinChange(event)} /> </td>
        </tr>;
    }
    let section34 = null;
    let group34E = null;
    if(this.state.isSection3){
      section34 =
        <tr>
          <th>
            <table >
              <tbody>
                <tr>
                  <td width="20%"><input id="cb-group34" type="checkbox" checked={this.state.isGroup34} onChange={(event) => this.isGroup34Change(event)}/></td>
                  <td ><label htmlFor="cb-group32" >Включить группу 4 раздела 3</label></td>
                </tr>
              </tbody>
            </table>
          </th>
          <td></td>
        </tr>;
    }
    if(this.state.isSection3 && this.state.isGroup34){
      group34E = 
        <tr>
          <th>Состояние поверхности почвы при наличии снежного покрова</th>
          <td><Select id="soil-snow" value={this.state.soilSnowR} onChange={this.handleSoilSnowChange} options={soilSnow}/></td>
        </tr>;
    }
    return(
      <div>
        <label htmlFor="tlg-text">Текст телеграммы</label>
        <input id="tlg-text" type="text" value={this.state.tlgText} readOnly={true} />
        {/*<br/>
        <label htmlFor="observation-date">Дата наблюдения</label>
        <input id="observation-date" type="date" value={this.state.observationDate} onChange={(event) => this.handleDateChange(event)}/>
        <label htmlFor="term">Срок</label>
        <Select id="term" value={this.state.termR} onChange={this.handleTermChange} options={terms}/>*/}
        {/*<table className = "table table-bordered">*/}
        <table className="table table-hover">
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
                <table>
                  <tbody>
                    <tr>
                      <td width="20%"><input id="cb-wind-d" type="checkbox" checked={this.state.isAnemometer} onChange={(event) => this.isAnemometerChange(event)}/></td>
                      <td><label htmlFor="cb-wind-d" >По румбометру</label></td>
                    </tr>
                  </tbody>
                </table>
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
            <tr>
              <th>Характеристика барической тенденции a</th>
              <td><Select id="baric-trend" value={this.state.baricTrendR} onChange={this.handleBaricTrendChange} options={baricTrends}/></td>
            </tr>
            <tr>
              <th>Значение барической тенденции ppp (hPa)</th>
              <td><input type='number' value={this.state.baricTrendValue} min='0' max='100' step='0.1'  onChange={(event) => this.handleBTValueChange(event)} /> </td>
            </tr>
            {group6RRR}
            {group6tR}
            {group7ww}
            {group7W1}
            {group7W2}
            <tr>
              <th>
                <table >
                  <tbody>
                    <tr>
                      <td width="20%"><input id="cb-clouds" type="checkbox" checked={this.state.isGroup8} onChange={(event) => this.isGroup8Change(event)}/></td>
                      <td ><label htmlFor="cb-clouds" >Включить группу 8</label></td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <td></td>
            </tr>
            {group8N}
            {group8CL}
            {group8CM}
            {group8CH}
            <tr>
              <th>
                <table >
                  <tbody>
                    <tr>
                      <td width="20%"><input id="cb-section3" type="checkbox" checked={this.state.isSection3} onChange={(event) => this.isSection3Change(event)}/></td>
                      <td ><label htmlFor="cb-section3" >Включить раздел 3</label></td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <td></td>
            </tr>
            {section31}
            {group31}
            {section32}
            {group32}
            {section34}
            {group34E}
          </tbody>
        </table>
        <label htmlFor="tlg-text2">Текст телеграммы</label>
        <input id="tlg-text2" type="text" value={this.state.tlgText} readOnly={true} />
      </div>
    );
  }
}
