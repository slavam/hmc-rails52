import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class NormalVolumeParams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.postId,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo
    };
    // this.handleOptionSelected = this.handleOptionSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    // alert('handleSubmit')
    var postId = this.state.postId;
    var dateFrom = this.state.dateFrom;
    var dateTo = this.state.dateTo;
    if (!dateFrom || !dateTo || !postId) {
      return;
    }
    this.props.onParamsSubmit({dateFrom: dateFrom, dateTo: dateTo, postId: postId});
  }
  handlePostSelected(value){
    this.state.postId = value;
  }
  dateFromChange(e) {
    this.setState({dateFrom: e.target.value});
  }
  dateToChange(e) {
    this.setState({dateTo: e.target.value});
  }
  render() {
    // var defaultId = this.props.regionType == 'post' ? 5 : 1;
    return (
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className= "table table-hover">
          <thead>
            <tr>
              <th>Пост</th>
              <th>Начальная дата</th>
              <th>Конечная дата</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <StationSelect options={this.props.posts} onUserInput={(event) => this.handlePostSelected(event)} defaultValue={this.state.postId}/>
                {/*<ChemOptionSelect options={this.props.posts} onUserInput={this.handleOptionSelected} name="selectPost" key="selectPost" defaultValue = {this.state.postId}/>*/}
              </td>
              <td>
                <input type="date" name="dateFrom" value={this.state.dateFrom} onChange={this.dateFromChange} />
              </td>
              <td>
                <input type="date" name="dateTo" value={this.state.dateTo} onChange={this.dateToChange} />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}