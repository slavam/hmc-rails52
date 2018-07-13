import React from 'react';
import FoundTelegram from './found_telegram';
export default class FoundTelegrams extends React.Component{
  render() {
    var rows = [];
    this.props.telegrams.forEach(t => {
      t.date = t.date.replace(/T/,' ');
      rows.push(<FoundTelegram telegram={t} key={t.id}/>);
    });
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th width = "200px">Дата</th>
            <th>Срок</th>
            <th>Метеостанция</th>
            <th>Текст</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
