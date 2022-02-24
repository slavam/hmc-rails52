import React, {Component} from 'react';
import Select from 'react-select';
// console.log(React.version);
export default class WindSearchForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      station: {label: 'Донецк', value: 1},
      year:  this.props.year,
      month: this.props.month
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearchSubmit(this.state.station.value, this.state.year, this.state.month);
  }
  handleStationSelected = (val) => {
    this.setState({station: val});
  }
  dateChange = (e) => {
    this.setState({year: e.target.value.substr(0,4), month: e.target.value.substr(5,2)});
  }
  render() {
    return (
        <div className="col-md-12">
          <form className="searchForm" onSubmit={(event) => this.handleSubmit(event)}>
            <Select value={this.state.station} onChange={this.handleStationSelected} options={this.props.stations}/>
            <input type="month" name="input-date" value={this.state.year+'-'+this.state.month} onChange={(event) => this.dateChange(event)} autoComplete="on" />
            <input type="submit" value="Найти" />
          </form>
        </div>
    );
  }
}