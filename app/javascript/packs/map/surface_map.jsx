import React from 'react';

const StationInfoTable = ({telegram}) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>&#9675;</td>
          <td>&#9021;</td>
          <td>&#9684;</td>
          <td>&#9899;</td>
          <td>&#9898;</td>
        </tr>
        <tr>
          <td><img height="10px" src="/assets/weather/total_cloud_cover/N 5.svg"/></td>
          <td>{telegram.substr(26,3)}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default class SurfaceMap extends React.Component{
  constructor(props){
    super(props);
    this.stationInfo = this.stationInfo.bind(this);
  }
  arrowNumber(val){
    let ret = 0;
    switch(val % 5){
      case 0:
        ret = (val / 5)*2;
        break;
      case 1:
        ret = ((val-1) / 5)*2;
        break;
      case 2:
        ret = ((val-2) / 5)*2+1;
        break;
      case 3:
        ret = ((val-3) / 5)*2+1;
        break;
      case 4:
        ret = ((val+1) / 5)*2;
    }
    return ret < 10 ? '0'+ret : ret;
  }
  stationInfo(t){
    const sign = ['','-'];
    let airTemperature =+(sign[+t[25]]+t.substr(26,3));
    let airPressure = '';
    let meteoRange = +t.substr(15,2);
    let presentWeather = '';
    // let windSpeed = '<img height="15px" src="/assets/weather/wind_arrows/NH '+this.arrowNumber(+t.substr(21,2))+'.svg">'; 
    
    let hightCloud = t[14] == '/' ? '':t[14];
    let cloudHigh = '';
    let cloudMedium = '';
    let cloudLow = '';
    let cloudsNumber = '';
    if(/8[0-9/]{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/8[0-9/]{4}/).index;
      cloudsNumber = t.substr(30)[index+1];
      let val = t.substr(30)[index+4];
      if(val == '0' || val == '/')
        cloudHigh = '';
      else
        cloudHigh = '<img height="15px" src="/assets/weather/cloud_high/CH '+val+'.svg">';
      val = t.substr(30)[index+3];
      if(val == '0' || val == '/')
        cloudMedium = '';
      else
        cloudMedium = '<img height="15px" src="/assets/weather/cloud_medium/CM '+val+'.svg">';
      val = t.substr(30)[index+2];
      if(val == '0' || val == '/')
        cloudLow = '';
      else
        cloudLow = '<img height="15px" src="/assets/weather/cloud_low/CL '+val+'.svg">';
    }
    if(/4[0-9/]{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/4[0-9/]{4}/).index;
      airPressure = +t.substr(30).substr(index+1,4);
    }
    let pastWeather1 = '';
    let pastWeather2 = '';
    if(/7\d{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/7\d{4}/).index;
      let val = t.substr(30).substr(index+1,2);
      presentWeather = '<img height="15px" src="/assets/weather/present_weather/ww '+val+'.svg">';
      val = t.substr(30)[index+3];
      if(+val < 3 || val == '/')
        pastWeather1 = '';
      else
        pastWeather1 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
      val = t.substr(30)[index+4];
      if(+val < 3 || val == '/')
        pastWeather2 = '';
      else
        pastWeather2 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
    }
    let totalCloudCover = '<img height="15px" src="/assets/weather/total_cloud_cover/N '+t[18]+'.svg">';
    let pressureTendency = '';
    let pressureDelta = '';
    if(/5[0-8]\d{3}/.test(t.substr(30))){
      let index = t.substr(30).match(/5[0-8]\d{3}/).index;
      let a = t.substr(30)[index+1];
      pressureTendency = '<img height="15px" src="/assets/weather/pressure_tendency/a '+a+'.svg">';
      if(+a > 4)
        pressureDelta = '-'+t.substr(30).substr(index+3,2);
      else
        pressureDelta = t.substr(30).substr(index+3,2);
    }
    let dewPoint = +(sign[+t[31]]+t.substr(32,3));
    
    return '<table><tbody><tr><td></td><td></td><td>'+cloudHigh+'</td><td></td><td></td></tr><tr><td></td><td>'+airTemperature+'</td><td>'+cloudMedium+'</td><td>'+airPressure+'</td><td></td></tr><tr><td>'+meteoRange+'</td><td>'+presentWeather+'</td><td>'+totalCloudCover+'</td><td>'+pressureDelta+'</td><td>'+pressureTendency+'</td></tr><tr><td></td><td>'+dewPoint+'</td><td>'+cloudLow+'</td><td>'+cloudsNumber+' '+pastWeather1+'</td><td>'+pastWeather2+'</td></tr><tr><td></td><td></td><td></td><td>'+hightCloud+'</td></tr></tbody></table>';
  }
  render(){
    // const totalCloudCover = [9675,9021,9684,,9681,,9685,,9679,2297];
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {center: firstCoords, zoom: 7};
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let markers = [];
    let info = {};
    var icon = {
        // url: '/assets/weather/wind_arrows/NH '+this.arrowNumber(+t.substr(21,2))+'.svg',
        // url: '/assets/weather/wind_arrows/NH 10.svg',
        size: new google.maps.Size(30, 30),
        // origin: new google.maps.Point(-25, -25),
        // anchor: new google.maps.Point(20, 20),
        // rotation: 270,
        // fillOpacity: 0.5,
        // transform: rotate(45deg),
        scaledSize: new google.maps.Size(30, 10),
    };
    this.props.telegrams.map((t) => {
      let codeStation = t.telegram.substr(6,5);
      info[codeStation] = this.stationInfo(t.telegram);
      // info[codeStation] = <StationInfoTable telegram={t.telegram} />;
      let location = this.props.markerCoords[codeStation];
      if(t.telegram.substr(19,4)=='0000'){
        icon['scaledSize'] = new google.maps.Size(10, 10);
        icon['url'] = '/assets/weather/wind_arrows/Calm 00.svg';
      }else{
        icon['scaledSize'] = new google.maps.Size(30, 10);
        icon['url'] = '/assets/weather/wind_arrows/NH '+this.arrowNumber(+t.telegram.substr(21,2))+'.svg';
      }
      let marker = new google.maps.Marker({position: location, map: map, title: t.telegram, icon: icon, id: codeStation});
      // let marker = new MarkerWithLabel({
      //   position: location, 
      //   map: map, 
      //   labelContent: this.stationInfo(t.telegram),
      //   labelAnchor: new google.maps.Point(30, 30),
      //   title: codeStation,
      //   icon: icon});
      markers.push(marker);
    });
    // let marker = new MarkerWithLabel({
    //   position: map.getCenter(),
    //   map: map,
    //   icon: {
    //     url: "http://www.geocodezip.com/mapIcons/SO_20170123_svgMarker.svg",
    //     anchor: new google.maps.Point(62.5, 37),
    //   },
    //   // labelContent: '<b>27</b><img height="15px" src="/assets/weather/cloud_low/CL 1.svg">',
    //   labelContent: <StationInfoTable telegram={this.props.telegrams[0].telegram} />,
    //   labelAnchor: new google.maps.Point(10, 8),
    //   labelClass: "mapLabels", // the CSS class for the label
    //   labelStyle: {
    //     opacity: 0.8,
    //     color: "white"
    //   },
    //   title: "svg url"
    // });
    // markers.push(marker);
    var rotationAngle = 0;
    // google.maps.event.addListenerOnce(map, 'idle', function() {
    //     $('img[src="/assets/weather/wind_arrows/NH 10.svg"]').css({
    //       'transform': 'rotate(' + rotationAngle + 'deg)'
    //   });
    // });
    // google.maps.event.addDomListener(window, "load", function(){
    google.maps.event.addListenerOnce(map, 'idle', function() {
      setInterval(function() {
        $('img[src="/assets/weather/wind_arrows/NH 10.svg"]').css({
          'transform': 'rotate(' + rotationAngle + 'deg)'
      });
      // rotationAngle += 10;
    }, 1000);
    });
    markers.map( m => {
      var infowindow = new google.maps.InfoWindow({content: info[m.id],maxWidth: '500px'});
      m.addListener('click', () => infowindow.open(map, m));
      // var innerArrow = document.getElementById(m.label);
      // innerArrow.setAttribute("transform", "rotate("+rotationAngle+")");
      // rotationAngle += 10;
    });
    return(
      <div> 
      </div>
    );
  }
}