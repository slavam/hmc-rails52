import React from 'react';

export default class FireMap extends React.Component{
  constructor(props){
    super(props);
  }
  customIcon (opts) {
    return Object.assign({
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      // fillColor: '#34495e',
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    }, opts);
  }

  render(){
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {center: firstCoords, zoom: 7};
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let markers = [];
    if(this.props.fireDangers){
      // var pinColor = "FE7569";
      // var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
      //   new google.maps.Size(21, 34),
      //   new google.maps.Point(0,0),
      //   new google.maps.Point(10, 34));
      this.props.fireDangers.map((fd) => {
        let location = new google.maps.LatLng(this.props.stations[fd.station_id-1].latitude, this.props.stations[fd.station_id-1].longitude);
        let markerColor = "#FE7569";
        if (fd.fire_danger <= 400)
          markerColor = '#2ecc71'; // green
        else if(fd.fire_danger>400 && fd.fire_danger<=1000)
          markerColor = '#2e71cc'; //blue
        else if (fd.fire_danger>1001 && fd.fire_danger<=3000)
          markerColor = '#ffcc00'; //yellow
        else if (fd.fire_danger>3001 && fd.fire_danger<=5000)
          markerColor = '#ff7000';
        else
          markerColor = "#FE0000";
        let marker = new google.maps.Marker({position: location, map: map, icon: this.customIcon({fillColor: markerColor})});
        markers.push(marker);
      });
    }
    //   var pinColor = "FE7569";
    // var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    //     new google.maps.Size(21, 34),
    //     new google.maps.Point(0,0),
    //     new google.maps.Point(10, 34));
    // var marker = new google.maps.Marker({
    //             position: new google.maps.LatLng(0,0), 
    //             map: map,
    //             icon: pinImage,
    //             shadow: pinShadow
    //         });
    return(
      <div> 
      </div>
    );
  }
}