import React from 'react';

export default class FireMap extends React.Component{
  constructor(props){
    super(props);
    // this.stationInfo = this.stationInfo.bind(this);
  }
  // stationInfo(date, telegram){
  //   let codeWAREP = telegram.substr(26,2);
  //   let phase = telegram[3] == 'Я'? 'Старт/Рост' : 'Конец';
  //   return date.substr(0,16).replace(/T/,' ')+' (UTC) '+this.props.fact[codeWAREP]+' '+phase+'<br/>';
  // }
  render(){
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {center: firstCoords, zoom: 7};
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let markers = [];
    let info = {};
    // this.props.telegrams.map((t) => {
    //   let fireClass = t.telegram.substr(12,5);
      
    //   if(!info[codeStation]){
    //     info[codeStation] = '<b>'+t.station_name+'</b><br/>';
    //     let location = this.props.markerCoords[codeStation];
    //     let marker = new google.maps.Marker({position: location, map: map, label: codeStation});
    //     markers.push(marker);
    //   }
    //   info[codeStation] += this.stationInfo(t.date, t.telegram); // 20190618
    // });
    // markers.map( m => {
    //   var infowindow = new google.maps.InfoWindow({content: info[m.label]});
    //   m.addListener('click', () => infowindow.open(map, m));
    //   // m.addListener('click', function() {infowindow.open(map, m); });
    // });
    return(
      <div> 
      </div>
    );
  }
}