import React from 'react';

export default class TabPanels extends React.Component{
  render(){
    let rows = [];
    
    this.props.tabContent.forEach((d, i) => {
      rows.push(<tr key={i}><td key={d.id}>{d.report_date}</td><td>{d.curr_number}</td></tr>);
    });
    
    return(
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Номер</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}