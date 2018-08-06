import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';

export default class DownloadParams extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      date: this.props.date,
      term: this.props.term
    };
    this.handleTermSelected = this.handleTermSelected.bind(this);
  }
  dateChange(e){
    this.setState({date: e.target.value});
  }
  handleTermSelected(value){
    this.setState({term: value});
  }
  handleSubmit(){
    this.props.onSubmit(this.state.date, this.state.term);
  }
  render(){
    const terms = [
      { value: '00', label: '00' },
      { value: '03', label: '03' },
      { value: '06', label: '06' },
      { value: '09', label: '09' },
      { value: '12', label: '12' },
      { value: '15', label: '15' },
      { value: '18', label: '18' },
      { value: '21', label: '21' }
    ];
    return(
      <form className="downloadForm" onSubmit={(event) => this.handleSubmit(event)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Срок</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" value={this.state.date} onChange={(event) => this.dateChange(event)} required="true" autoComplete="on" /></td>
              <td><TermSynopticSelect options={terms} onUserInput={this.handleTermSelected} defaultValue={this.state.term}/></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Отобрать" />
      </form>
    );
  }
}