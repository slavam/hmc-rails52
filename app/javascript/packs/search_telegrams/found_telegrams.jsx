import React from 'react';
import FoundTelegram from './found_telegram';
export default class FoundTelegrams extends React.Component{
  constructor(props){
    super(props);
    this.asc = true;  
    this.state = {
      arrow: 'V'
    };
    this.sortBy;
  }
  sortDirection(){
    const getDate = o => o.date;
    let a;
    if(this.asc){
      this.sortBy = fn => (a, b) => -(fn(a) < fn(b)) || +(fn(a) > fn(b));
      a = 'V';
    } else {
      this.sortBy = fn => (a, b) => -(fn(a) > fn(b)) || +(fn(a) < fn(b));
      a = '^';
    }
    const sortByDate = this.sortBy(getDate);
    this.props.telegrams.sort(sortByDate);
    this.setState({arrow: '^'});
    this.asc = !this.asc;
    this.setState({arrow: a});
  }
  render() {
    var rows = [];
    this.props.telegrams.forEach(t => {
      t.date = t.date.replace(/T/,' ');
      rows.push(<FoundTelegram fact={this.props.fact} telegram={t} key={t.id} tlgType={this.props.tlgType} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} tlgTerm={this.props.tlgTerm} tlgText={this.props.tlgText} stationId={this.props.stationId}/>);
    });
    const optHead = this.props.tlgType == 'synoptic' ? <th>Срок</th> : this.props.tlgType == 'storm' ? <th>Тип</th> : <th></th>;
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th><button type="button" id="download-pdf" onClick={(event) => this.sortDirection(event)}>Дата {this.props.tlgType == 'synoptic' ? 'наблюдения (UTC)' : (this.props.tlgType == 'storm' ? 'явления (UTC)':'') } {this.state.arrow}</button><br/></th>
            {optHead}
            <th>Метеостанция</th>
            <th>Текст</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}