import React from 'react';
import Select from 'react-select';

export default class TeploenergoForm extends React.Component{
  constructor(props) {
    super(props);
    let today = new Date();
    let year = today.getMonth()>8? today.getFullYear() : today.getFullYear()-1;
    this.state = {
      year:  this.props.year,
      monthR: {value: '10', label: 'Октябрь '+year}
      // month: this.props.month
    };
    this.handleMonthSelected = this.handleMonthSelected.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.year, this.state.monthR.value);
  }
  // dateChange(e){
  //   // alert(e.target.value)
  //   this.setState({year: e.target.value.substr(0,4), month: e.target.value.substr(5,2)});
  // }
  // yearChange(e){
  //   this.setState({year: e.target.value});
  // }
  handleMonthSelected(val){
    this.setState({monthR: val, year: val.label.substr(-4)});
  }
  render() {
    let today = new Date();
    let year1;
    let year2;
    if(today.getMonth()>8){
      year1 = today.getFullYear();
      year2 = year1+1;
    }else{
      year2 = today.getFullYear();
      year1 = year2-1;
    }
    const months = [
      {value: '10', label: 'Октябрь '+year1},
      {value: '11', label: 'Ноябрь '+year1},
      {value: '12', label: 'Декабрь '+year1},
      {value: '01', label: 'Январь '+year2},
      {value: '02', label: 'Февраль '+year2},
      {value: '03', label: 'Март '+year2},
      {value: '04', label: 'Апрель '+year2}
    ];
    return (
    <div className="col-md-12">
      <h4 align="center">Задайте месяц и год</h4>
      <form className="dateForm" onSubmit={(event) => this.handleSubmit(event)}>
        <Select value={this.state.monthR} onChange={this.handleMonthSelected} options={months}/>
        <br/>
        <input type="submit" value="Пересчитать" />
      </form>
    </div>
    );
  }
}