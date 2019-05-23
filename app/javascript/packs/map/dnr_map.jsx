import React from 'react';
// import { Observable } from "rxjs/Rx";
export default class DNRMap extends React.Component{
  constructor(props){
    super(props);
    this.stationInfo = this.stationInfo.bind(this);
  }
  stationInfo(date, telegram){
    let codeWAREP = telegram.substr(26,2);
    let phase = telegram[3] == 'Я'? 'Старт/Рост' : 'Конец';
    return date.substr(0,16).replace(/T/,' ')+' '+this.props.fact[codeWAREP]+' '+phase+'<br/>';
  }
  render(){
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {center: firstCoords, zoom: 7};
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let markers = [];
    let info = {};
    this.props.telegrams.map((t) => {
      let codeStation = t.telegram.substr(12,5);
      
      if(!info[codeStation]){
        info[codeStation] = '<b>'+t.station_name+'</b><br/>';
        let location = this.props.markerCoords[codeStation];
        let marker = new google.maps.Marker({position: location, map: map, label: codeStation});
        // let markerClickStream = Observable.fromEvent(marker, 'click')
          // .subscribe(() => {alert(marker.label)}) ;
        markers.push(marker);
      }
      info[codeStation] += this.stationInfo(t.date, t.telegram);
    });
    markers.map( m => {
      var infowindow = new google.maps.InfoWindow({content: info[m.label]});
      m.addListener('click', function() {
        infowindow.open(map, m);
      });
    });
      // let location = new google.maps.LatLng(this.props.markerCoords[codeStation][0], this.props.markerCoords[codeStation][1]);
      // let location = this.props.markerCoords[codeStation];
      // let label = t.telegram.substr(26,2); // WAREP code
      // let marker = new google.maps.Marker({position: location, label: label, map: map});
      // let imageMap = document.getElementById('form_and_result');
      // let markerClickStream = Rx.Observable.fromEvent(imageMap, 'click')
        // .subscribe(() => { window.open('qqqqqqqqqqqqq','popUpWindow','height=700,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
		// 	}) ;
        // .subscribe(() => {alert(marker.label)}) ;
      // this.state.markers.push(marker);
      // let src = "https://www.google.com/maps/embed/v1/place?key="+this.props.googleKey+"&q=Любавина+2,Донецк,Донецкая+область";
    return(
      <div> 
      </div>
    );
  }
}