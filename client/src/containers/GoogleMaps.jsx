import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import { HotelPin, YelpPin, FlightPin } from '../components/Pins';
import { googleMaps } from '../keys/mapsKey';


const GoogleMaps = ({ locator, mapArray }) => {
  if (locator === undefined) {
    return (
      <div>loading</div>
    );
  }
  return (
    <GoogleMapReact
      options={{ scrollwheel: false }}
      defaultCenter={{ lat: locator.latitude, lng: locator.longitude }}
      defaultZoom={11}
      bootstrapURLKeys={{ key: googleMaps() }}
    >
      {mapArray.map((elem) => {
        if (elem.latitude) {
          return (
            <FlightPin
              lat={elem.latitude}
              lng={elem.longitude}
              key={elem.city}
            />);
        } else if (elem.lat) {
          return (<HotelPin
            lat={elem.lat}
            lng={elem.lng}
            key={elem.id}
          />);
        }
        return (<YelpPin
          lat={elem.coordinates.latitude}
          lng={elem.coordinates.longitude}
          key={elem.name}
        />);
      })}
    </GoogleMapReact>
  );
};
GoogleMaps.defaultProps = {
  mapArray: [],
  locator: {},
};
GoogleMaps.propTypes = {
  locator: PropTypes.shape({
    administrativeLevels: PropTypes.shape({
      level1long: PropTypes.string,
      level1short: PropTypes.string,
      level2long: PropTypes.string,
      level2short: PropTypes.string,
    }),
    city: PropTypes.string,
    country: PropTypes.string,
    countryCode: PropTypes.string,
    extra: PropTypes.shape({
      confidence: PropTypes.number,
      establishment: PropTypes.string,
      googlePlaceId: PropTypes.string,
      neightborhood: PropTypes.string,
      premise: PropTypes.string,
      subpremise: PropTypes.string,
    }),
    formattedAddress: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    provider: PropTypes.string,
  }),
  mapArray: PropTypes.arrayOf(
    PropTypes.shape,
  ),
};

export default GoogleMaps;
