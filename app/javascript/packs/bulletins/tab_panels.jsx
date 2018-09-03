import React from 'react';
import TabPanel from '../tabs/components/TabPanel';

export default class TabPanels extends React.Component{
  render(){
    let panels = new Array(this.props.tabNumber).fill(<TabPanel></TabPanel>);
    
    return(
      {panels}
    );
  }
}