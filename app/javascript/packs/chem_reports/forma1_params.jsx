import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class Forma1Params extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.postId,
      month: this.props.month,
      year: this.props.year
    };
    this.handlePostSelected = this.handlePostSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dateChange = this.dateChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    var site = this.state.postId;
    var month = this.state.month.trim();
    var year = this.state.year.trim();
    if (!year || !month || !site) {
      return;
    }
    this.props.onParamsSubmit({site: site, month: month, year: year});
  }
  handlePostSelected(value){
    this.state.postId = value;
  }
  dateChange(e) {
    var date = e.target.value;
    var year = date.substr(0,4);
    var month = date.substr(5,2);
    this.setState({year: year, month: month});
  }
  render() {
    var yearMonth = this.state.year+'-'+this.state.month;
    return (
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className= "table table-hover">
          <thead>
            <tr>
              <th>Пост</th>
              <th>Период</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <StationSelect options={this.props.posts} onUserInput={this.handlePostSelected} defaultValue={this.state.postId}/>
              </td>
              <td>
                <input type="month" value={yearMonth} min="2000-01" max="2030-01" onChange={this.dateChange}/>
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}
