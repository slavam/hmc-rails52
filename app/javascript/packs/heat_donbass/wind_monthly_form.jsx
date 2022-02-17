import React, {Component} from 'react';

export default class WindMonthlyForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      wind: this.props.wind,
      numDays: this.props.numDays
    }
  }
  handleWindSubmit = (e) => {
    e.preventDefault();
    this.props.onWindSubmit(this.state.wind);
  }
  handleWindChange = (e) => {
    const i = parseInt(e.target.id / 8);
    const j = e.target.id % 8;
    // alert(`${e.target.id}--${i}--${j}`)
    this.state.wind[i][j] = e.target.value;
    this.setState({wind: this.state.wind})
  }
  render(){
    let rows = [];
    for (let i=0; i<this.props.numDays; i++){
      let row = [];
      for (let j=0; j<8; j++){
        row.push(<td key={i*8+j}><input key={i*8+j} id={i*8+j} type='number' min='0' max='360' value={this.state.wind[i][j]} onChange={(event) => this.handleWindChange(event)} /></td>)
      }
      rows.push(<tr key={i}><td>{i+1}</td>{row}</tr>)
    }
    return(
      <div className='container'>
        <h4>Введите данные за месяц {this.props.numDays}</h4>
        <form className="windForm" onSubmit={(event) => this.handleWindSubmit(event)}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Число</th>
                <th>С</th>
                <th>СВ</th>
                <th>В</th>
                <th>ЮВ</th>
                <th>Ю</th>
                <th>ЮЗ</th>
                <th>З</th>
                <th>СЗ</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
          <input type="submit" value="Сохранить" />
        </form>
      </div>
    );
  }
}