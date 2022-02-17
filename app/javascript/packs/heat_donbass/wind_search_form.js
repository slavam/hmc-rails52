// import React, {Component} from 'react';
import React, { useState } from 'react';
import Select from 'react-select';
console.log(React.version);
// export default class WindSearchForm extends Component{
//   constructor(props) {
//     super(props);
//     this.state = {
//       station: {label: 'Донецк', value: 1},
//       year:  this.props.year,
//       month: this.props.month
//     };
//   }

const WindSearchForm = (props) =>{
  const initStation = {label: 'Донецк', value: 1}
  const [station, setStation] = useState(initStation);
  const [year, setYear] = useState(props.year);
  const [month, setMonth] = useState(props.month);
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearchSubmit(station.value, year, month);
  }
  handleStationSelected = (val) => {
    setStation(val);
    // this.setState({station: val});
  }
  dateChange = (e) => {
    setYear(e.target.value.substr(0,4));
    setMonth(e.target.value.substr(5,2));
    // this.setState({year: e.target.value.substr(0,4), month: e.target.value.substr(5,2)});
  }
  // render() {
    return (
        <div className="col-md-12">
          <h4 align="center">Задайте месяц и год</h4>
          <form className="searchForm" onSubmit={(event) => this.handleSubmit(event)}>
            <Select value={station} onChange={this.handleStationSelected} options={this.props.stations}/>
            <input type="month" name="input-date" value={year+'-'+month} onChange={(event) => this.dateChange(event)} autoComplete="on" />
            <input type="submit" value="Найти" />
          </form>
        </div>
    );
  // }
}

export default WindSearchForm;