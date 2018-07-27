import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class WindRoseForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      year: this.props.year,
      cityId: this.props.cityId
    };
  }
  yearChange(e){
    this.setState({year: e.target.value});
  }
  handleCitySelected(value){
    this.setState({cityId: +value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.year, this.state.cityId);
  }
  render(){
    return(
      <form className="paramsForm" onSubmit={(event) => this.handleSubmit(event)}>
        <input type="number" min="2015" max="2099" step="1" value={this.state.year} onChange={(event) => this.yearChange(event)}/>
        <StationSelect options={this.props.cities} onUserInput={(event) => this.handleCitySelected(event)} defaultValue={this.state.cityId}/>
        <input type="submit" value="Пересчитать"/>
      </form>
    );
  }
}
