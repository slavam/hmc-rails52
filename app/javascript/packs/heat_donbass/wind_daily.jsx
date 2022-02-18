import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

const stations = ['','Донецк','Амвросиевка','Дебальцево','','','','','','','Седово'];
const stationsArray = [];
stations.map((s,i) => {return (s !== '') ? stationsArray.push({label: s, value: i}) : null});

export default class WindDaily extends Component{
  constructor(props){
    super(props)
    this.state = {
      obsDate: this.props.obsDate,
      wind: this.props.wind,
      // t0: this.props.wind[0],
      // t1: this.props.wind[1],
      // t2: this.props.wind[2],
      // t3: this.props.wind[3],
      // t4: this.props.wind[4],
      // t5: this.props.wind[5],
      // t6: this.props.wind[6],
      // t7: this.props.wind[7],
      station: {label: 'Донецк', value: 1}
    }
  }
  dateChange = (e) =>{
    this.setState({obsDate: e.target.value})
  }
  handleStationSelected = (val) => {
    this.setState({station: val});
  }
  inputChanged = (e) => {
    // switch(e.target.id){
    //   case '0':
    //     this.setState({t0: e.target.value});
    //     break;
    //   case '1':
    //     this.setState({t1: e.target.value});
    //     break;
    // }
    const i = e.target.id;
    const w = this.state.wind;
    w[i] = e.target.value;
    this.setState({wind: w})
  }
  handleSearchSubmit = (e) =>{
    e.preventDefault();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/other_observations/wind_daily_data?obs_date=${this.state.obsDate}&station_id=${this.state.station.value}`
      }).done((data) => {
        // this.setState({t0: data.wind[0], t1: data.wind[1]})
        this.setState({wind: data.wind});
        // alert(JSON.stringify(this.state.wind[0]))
      }).fail((res) => {
        alert("Проблемы с чтением данных из БД")
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      });
  }
  handleWindSubmit = (e) =>{
    e.preventDefault();
  }
  render(){
    const inputs = []
    for(let i=0; i<8; i++){
      inputs.push(<input type="number" key={i} id={i} value={this.state.wind[i] ? this.state.wind[i]:"??"} onChange={(e) => this.inputChanged(e)}/>)
    }
    
    const row = [];
    for(let i=0; i<8; i++){
      row.push(<td key={i}>{this.state.wind[i] ? this.state.wind[i] : "?"}</td>)
    }
    const wind_terms = <tr>{row}</tr>
    return(
      <div className='container'>
        <form className="searchForm" onSubmit={(event) => this.handleSearchSubmit(event)}>
          <Select value={this.state.station} onChange={this.handleStationSelected} options={stationsArray}/>
          <input type="date" name="obs-date" value={this.state.obsDate} min="1991-01-01" onChange={this.dateChange} required="true" autoComplete="on" />
          <input type="submit" value="Найти" />
        </form>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>00</th>
              <th>03</th>
              <th>06</th>
              <th>09</th>
              <th>12</th>
              <th>15</th>
              <th>18</th>
              <th>21</th>
            </tr>
          </thead>
          <tbody>{wind_terms}</tbody>
          </table>
        <form className="windForm" onSubmit={(event) => this.handleWindSubmit(event)}>
          {inputs}
          <input type="submit" value="Сохранить" />
        </form>
    
      </div>
    );
  }
}

$(() => {
    const node = document.getElementById('init-params');
    if(node) {
      const wind = JSON.parse(node.getAttribute('wind'));
      const obsDate = JSON.parse(node.getAttribute('obsDate'));
      const stationId = JSON.parse(node.getAttribute('stationId'));
      
      ReactDOM.render(
        <WindDaily wind={wind} obsDate={obsDate} stationId={stationId} />,
        document.getElementById('root')
      );
    }
  });