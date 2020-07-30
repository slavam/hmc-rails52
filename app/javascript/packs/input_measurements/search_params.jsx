/*jshint esversion: 6 */
import React from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap';

export default class SearchParams extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      measurements: this.props.measurements,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      termR: { value: '99', label: 'Все' },
      postR: {value: 0, label: 'Все' },
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handlePostSelected = this.handlePostSelected.bind(this);
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.onParamsSubmit({dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, postId: this.state.postR.value, term: this.state.termR.value});
  }
  dateFromChange(e){
    this.setState({dateFrom: e.target.value.substr(0,10)});
  }
  dateToChange(e){
    this.setState({dateTo: e.target.value.substr(0,10)});
  }
  handleTermSelected(termR){
    this.setState({termR});
  }
  handlePostSelected(postR){
    this.setState({postR});
  }
  render(){
    const terms = [
      { value: '99', label: 'Все' },
      { value: '01', label: '01' },
      { value: '07', label: '07' },
      { value: '13', label: '13' },
      { value: '19', label: '19' }
    ];
    const posts = [{value: 0, label: 'Все'}];
    this.props.posts.forEach( p => {
      posts.push({value: p.id, label: p.name});
    });
    return (
      <div className='container'>
        <div className='row row-content'>
          <div className='col-12'>
            <h3>Параметры поиска</h3>
          </div>
          <div className='col-12'>
            <form className="params-form" onSubmit={(event) => this.handleSubmit(event)}>
              <table className='table table-striped'>
                <thead className='thead-dark'>
                  <tr>
                    <th>Дата с</th>
                    <th>Дата по</th>
                    <th>Срок</th>
                    <th>Пост</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="date" name="input-date-from" value={this.state.dateFrom} onChange={this.dateFromChange} autoComplete="on" /></td>
                    <td><input type="date" name="input-date-to" value={this.state.dateTo} onChange={this.dateToChange} autoComplete="on" /></td>
                    <td><Select value={this.state.termR} onChange={this.handleTermSelected} options={terms}/></td>
                    <td><Select value={this.state.postR} onChange={this.handlePostSelected} options={posts}/></td>
                  </tr>
                </tbody>
              </table>
              <p>
                <span style={{color: 'red'}}>{this.state.errors[0]}</span>
              </p>
              <input type="submit" value="Искать" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
