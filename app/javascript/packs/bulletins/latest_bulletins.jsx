import React from 'react';
import ReactDOM from 'react-dom';

export default class LatestBulletins extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      bulletins: this.props.bulletins
    };
    this.updateBulletinsState = this.updateBulletinsState.bind(this);
  }
  updateBulletinsState(data) {
    let bulletins = [...this.state.bulletins];
    let bulletinsCopy = bulletins.slice();
    let bulletinId = bulletinsCopy.findIndex((element, index, array) => element.id == data.bulletin_id);
    if(data.mode == 'start_editing'){
      if(bulletinId != -1){
        bulletinsCopy[bulletinId].user_login = data.user_login;
        bulletinsCopy[bulletinId].start_editing = data.start_editing;
      }
    }else if(data.mode == 'stop_editing'){
      if(bulletinId != -1){
        bulletinsCopy[bulletinId].user_login = '';
        bulletinsCopy[bulletinId].start_editing = null;
      }
    }else if(data.mode == 'new_bulletin'){
      bulletinsCopy = [data.bulletin].concat(bulletins);
    }else{
      if(bulletinId != -1)
        bulletinsCopy.splice(bulletinId, 1);
    }
    this.setState( {bulletins: bulletinsCopy} );
  }
  
  render(){
    App.candidate = App.cable.subscriptions.create({
        channel: "BulletinChannel", 
      },
      {received: data => {
        // alert(data.mode)
        this.updateBulletinsState(data);
      }
    });
    let rows = [];
    this.state.bulletins.forEach((b) => {
      let editLink = b.id+'/edit';
      let showLink = b.id+'/bulletin_show.pdf'; //?variant=two_pages';
      let title = null;
      // let bColor = '#fff';
      if(b.user_login != ''){
        title = 'Пользователь '+b.user_login+' редактирует бюллетень';
        // bColor = '#f00';
      }
      rows.push(<tr title={title} style={{background: b.user_login == ''? '#fff' : '#f00'}} key={b.id}><td>{b.created_at}</td><td>{b.bulletin_type}</td><td>{b.curr_number}</td><td><a href={editLink}>Изменить</a></td><td><a href={showLink}>Просмотреть</a></td></tr>);
    });
    return(
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Дата создания</th>
            <th>Тип</th>
            <th>Номер</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

$(() => {
  const node = document.getElementById('init_params');
  if(node){
    const bulletins = JSON.parse(node.getAttribute('bulletins'));
    ReactDOM.render(
      <LatestBulletins bulletins={bulletins} />,
      document.getElementById('bulletins')
    );
  }
})