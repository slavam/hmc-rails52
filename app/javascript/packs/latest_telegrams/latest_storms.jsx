import React from 'react';
import ReactDOM from 'react-dom';

export default class LatestStorms extends React.Component{
  constructor(props) {
    super(props);
    this.updateTelegramsState = this.updateTelegramsState.bind(this);
    this.state = {
      telegrams: this.props.telegrams
    };
    this.fact = {
      11: "Ветер",
      12: "Сильный ветер",
      17: "Шквал",
      18: "Шквал",
      19: "Смерч",
      30: "Низкая облачность",
      40: "Видимость",
      50: "Гололед",
      51: "Сложные отложения",
      52: "Налипание мокрого снега",
      61: "Сильный дождь",
      71: "Сильный снег",
      91: "Гроза"
    };
  }
  updateTelegramsState(telegram) {
    let telegrams = [...this.state.telegrams];
    let telegramsCopy = telegrams.slice();
    let telegramId = telegramsCopy.findIndex((element, index, array) => element.id == telegram.id);
    if (telegramId == -1) {
      telegramsCopy = [telegram].concat(telegrams);
    } else {
      telegramsCopy[telegramId] = telegram;
    }
    this.setState( {telegrams: telegramsCopy} );
  }
  render(){
    let rows = [];
    this.state.telegrams.forEach((t) => {
      let date1 = t.telegram_date.replace(/T/,' ').substr(0, 19)+' UTC';
      let date2 = t.created_at.replace(/T/,' ').substr(0, 19)+' UTC';
      let title = (t.telegram[3] == 'Я'? 'Начало/усиление; ':'Завершение; ')+this.fact[t.telegram.substr(26,2)];
      rows.push(<tr key={t.id}><td>{date2}</td><td>{date1}</td><td>{this.props.stations[t.station_id-1].name}</td><td title={title}>{t.telegram}</td></tr>);
    });
    App.candidate = App.cable.subscriptions.create({
        channel: "SynopticTelegramChannel", 
      },
      {received: data => {
        if(data.tlgType == 'storm'){
          // this.snd.play();
          data.telegram.telegram_date = data.telegram.date;
          this.updateTelegramsState(data.telegram);
        }
      }
    });
    return(
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Дата/время создания (UTC)</th>
            <th>Дата/время явления (UTC)</th>
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