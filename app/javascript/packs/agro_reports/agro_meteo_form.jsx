import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';

export default class AgroMeteoForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      year: this.props.year,
      month: this.props.month < 10 ? '0'+this.props.month : this.props.month,
      decade: this.props.decade
    };
    this.handleDecadeSelected = this.handleDecadeSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  dateChange(e) {
    var date = e.target.value;
    var year = date.substr(0,4);
    var month = date.substr(5,2);
    this.setState({year: year, month: month});
  }
  handleDecadeSelected(value){
    this.setState({decade: value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onParamsSubmit(this.state);
  }
  
  render(){
    const decades = [{value: '1', label: 'Первая'}, {value: '2', label: 'Вторая'}, {value: '3', label: 'Третья'}];
    return(
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className= "table table-hover">
          <thead>
            <tr>
              <th>Декада</th>
              <th>Месяц и год</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><TermSynopticSelect options={decades} onUserInput={this.handleDecadeSelected} defaultValue={this.state.decade}/></td>
              <td><input type="month" id="start" name="start" value={this.state.year+'-'+this.state.month} onChange={event => this.dateChange(event)} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}