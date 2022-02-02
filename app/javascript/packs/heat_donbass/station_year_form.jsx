import React from 'react';
import Select from 'react-select';

export default class StationYearForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      station: {value: 1, label: 'Донецк'},
      year: this.props.year
    }
  }
  handleYearChanged = e => {
    this.setState({year: e.target.value})
  }
  handleStationChanged = (val) => {
    this.setState({station: val})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onParamsSubmit(this.state.station.value, this.state.year);
  }
  render(){
    let stations = []
    stations = this.props.stations.map(s => {return{value: s.id, label: s.name}});
    return(
      <form className="observationsForm" onSubmit={event => this.handleSubmit(event)}>
        <input type="number" min="2016" max="2099" step="1" value={this.state.year} onChange={e => this.handleYearChanged(e)}/>
        <Select value={this.state.station} onChange={this.handleStationChanged} options={stations}/>
        <br/>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}