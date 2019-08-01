import React from 'react';
import ReactDOM from 'react-dom';

export default class LatestStorms extends React.Component{
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   };
  // }
  
  render(){
    let rows = [];
    this.props.telegrams.forEach((t) => {
      let date1 = t.telegram_date.replace(/T/,' ').substr(0, 19)+' UTC';
      let date2 = t.created_at.replace(/T/,' ').substr(0, 19)+' UTC';
      rows.push(<tr key={t.id}><td>{date1}</td><td>{date2}</td><td>{this.props.stations[t.station_id-1].name}</td><td>{t.telegram}</td></tr>);
    });
    return(
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Дата/время явления (UTC)</th>
            <th>Дата/время создания (UTC)</th>
            <th>Метеостанция</th>
            <th>Текст</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

$(()=>{
  const node = document.getElementById('init_params');
  if(node){
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const tlgType = JSON.parse(node.getAttribute('tlgType'));
    
    ReactDOM.render(
      <LatestStorms telegrams={telegrams} stations={stations} tlgType={tlgType}/>,
      document.getElementById('telegrams')
    );
  }
}
);