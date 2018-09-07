import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class BackgroundConcentrationsForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      postId: 5,
      substanceId: 1,
    };
    this.handlePostSelected = this.handlePostSelected.bind(this);
    this.handleSubstanceSelected = this.handleSubstanceSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startDateChange = this.startDateChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onParamsSubmit({ postId: this.state.postId, 
                                materialId: this.state.substanceId, 
                                startDate: this.state.startDate, 
                                endDate: this.state.endDate});
  }
  handlePostSelected(value){
    this.state.postId = value;
  }
  handleSubstanceSelected(value){
    this.state.substanceId = value;
  }
  
  startDateChange(e) {
    this.setState({startDate: e.target.value});
  }
  endDateChange(e) {
    this.setState({endDate: e.target.value});
  }
  render() {
    return (
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата с</th>
              <th>Дата по</th>
              <th>Пост</th>
              <th>Вещество</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="input-date-from" value={this.state.startDate} onChange={this.startDateChange} required="true" autoComplete="on" /></td>
              <td><input type="date" name="input-date-to" value={this.state.endDate} onChange={this.endDateChange} required="true" autoComplete="on" /></td>
              <td><StationSelect options={this.props.posts} onUserInput={this.handlePostSelected} /></td>
              <td><StationSelect options={this.props.substances} onUserInput={this.handleSubstanceSelected} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}