import React, {Component} from 'react';

export default class WindMonthlyForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      wind: this.props.wind,
      numDays: this.props.numDays
    }
  }
  componentDidMount() {
    this.setState({wind: this.props.wind})
    // this.checkFocus();
    // alert('componentDidMount')
  }

  componentDidUpdate() {
    // this.checkFocus();
    // this.setState({wind: this.props.wind})
  }
  handleWindSubmit = (e) => {
    e.preventDefault();
    this.props.onWindSubmit(this.state.wind);
  }
  handleWindChange = (e) => {
    const i = parseInt(e.target.id / 8);
    const j = e.target.id % 8;
    this.state.wind[i][j] = e.target.value;
    this.setState({wind: this.state.wind})
  }
  render(){
    // console.log(">>>>>>>s"+JSON.stringify(this.state.wind[0]))
    // console.log(">>>>>>>p"+JSON.stringify(this.props.wind[0]))
    let rows = [];
    for (let i=0; i<this.props.numDays; i++){
      let row = [];
      for (let j=0; j<8; j++){
        row.push(<td key={i*8+j}><input key={i*8+j} id={i*8+j} value={this.state.wind[i][j]} type='number' min='0' max='360' onChange={(event) => this.handleWindChange(event)} /></td>)
      }
      rows.push(<tr key={i}><td>{i+1}</td>{row}</tr>)
    }
    return(
      <div className='container'>
        <h4>Введите данные за месяц</h4>
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