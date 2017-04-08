import React, { Component } from 'react';
import { fetchEvents } from '../actions/eventsAction';
import { connect } from 'react-redux';
import Event from '../components/Event';
import GoogleMapReact from 'google-map-react';
// import GoogleMaps from './GoogleMaps'
const  API = require('../keys/mapsKey.js');
import Pin from '../components/pin'

class Events extends Component {
  // constructor (props){
  //   super(props);
  // }
  
  render() {
    console.log(this.props)
    return(
        <div>
          <div className="maps">
            <GoogleMapReact
              defaultCenter={ {lat: this.props.geo.locator.latitude, lng: this.props.geo.locator.longitude} }
              defaultZoom={13}
              bootstrapURLKeys={{key: API.googleMaps()}} >
            {this.props.eventsArr.events.map((event, index) => 
              <Pin lat={event.coordinates.latitude} lng={event.coordinates.longitude} text={'X'} key={index}/>
            )}
           </GoogleMapReact>
        </div>
          {this.props.eventsArr.events.map((event, index) => 
            <Event event={event} key={index} /> 
          )}
       </div>
    );
  }
}

const mapStateToProps = ({ events, geo }) => ({
  eventsArr: events,
  geo: geo
});

export default connect(mapStateToProps, { fetchEvents })(Events);


    