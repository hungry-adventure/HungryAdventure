import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { destinationSet } from '../actions/destinationAction';
import { fetchGeo, fetchTerminal } from '../actions/geoAction';
import { fetchHotels } from '../actions/hotelAction';
import { flightBudget } from '../actions/budgetAction';
import { fetchYelpEvents } from '../actions/yelpAction';
import { fetchWeather } from '../actions/weatherAction';
import { currentDestination } from '../actions/currentStateAction';
import { destinationImage } from '../actions/budgetBarAction';
import { fetchViator } from '../actions/viatorAction';
import { fetchFrommers } from '../actions/frommersAction';


class DestinationEntry extends Component {
  constructor(props) {
    super(props);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  getRandomInt(min, max) {
    const mini = Math.ceil(min);
    const maxi = Math.floor(max);
    return Math.floor(Math.random() * (maxi - mini)) + mini;
  }

  handleSelect(destination) {
    this.props.destinationSet(destination);
    this.props.flightBudget({
      price: destination.price,
      original: Number(this.props.budget.original),
    });
    this.props.fetchTerminal({
      terminal: destination.IataCode,
      city: destination.city,
      country: destination.country,
    })
      .then((result) => {
        this.props.fetchHotels({
          latitude: result.payload.latitude,
          longitude: result.payload.longitude,
        });
      });
    this.props.fetchGeo({ city: destination.city, country: destination.country })
    .then((result) => {
      this.props.fetchWeather({
        latitude: result.payload.latitude,
        longitude: result.payload.longitude,
        time: destination.arrivalDate,
      });
    });
    this.props.destinationImage({ destination: destination.imageUrl[0] });
    this.props.fetchYelpEvents({ location: `${destination.city} ${destination.country}` });
    this.props.fetchViator({ location: destination.city });
    this.props.currentDestination({ destination });
    this.props.fetchFrommers({ location: destination.city });
    this.props.redirect('/destination');
  }

  render() {
    return (
      <section className="no-padding" id="locations">
        {this.props.destinations.destinations.map(destination => (
          <div className="col-lg-4 col-sm-6" key={destination.city + destination.price}>
            <div
              className="event-card"
              onClick={() => { this.handleSelect(destination); }}
            >
              <img
                src={
                  destination.imageUrl[this.getRandomInt(0, destination.imageUrl.length)]
                }
                className="customImg"
                alt="Not Found"
                onError={(e) => { e.target.src = 'https://ugotalksalot.files.wordpress.com/2016/06/no-thumb.jpg'; }}
              />
              <div className="card-text">
                {`$${destination.price} ${destination.city} , ${destination.country}`}
              </div>
            </div>
          </div>
      ))}
      </section>
    );
  }
}

DestinationEntry.defaultProps = {
  budget: { original: '',
    flight: 0,
    hotel: 0,
    loading: false,
    viatorEvents: 0,
    yelpEvents: 0,
  },
  destinations: { destinations: [] },
};

DestinationEntry.propTypes = {
  destinationSet: PropTypes.func.isRequired,
  flightBudget: PropTypes.func.isRequired,
  fetchTerminal: PropTypes.func.isRequired,
  fetchGeo: PropTypes.func.isRequired,
  fetchWeather: PropTypes.func.isRequired,
  fetchHotels: PropTypes.func.isRequired,
  fetchYelpEvents: PropTypes.func.isRequired,
  destinationImage: PropTypes.func.isRequired,
  fetchViator: PropTypes.func.isRequired,
  currentDestination: PropTypes.func.isRequired,
  fetchFrommers: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
  budget: PropTypes.shape({
    flight: PropTypes.number,
    hotel: PropTypes.number,
    loading: PropTypes.bool,
    original: PropTypes.string,
    viatorEvents: PropTypes.number,
    yelpEvents: PropTypes.number,
  }),
  destinations: PropTypes.shape({
    destinations: PropTypes.arrayOf(PropTypes.shape({
      IataCode: PropTypes.string,
      arrivalDate: PropTypes.string,
      carrier: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      departureDate: PropTypes.string,
      imageUrl: PropTypes.arrayOf(PropTypes.string),
      price: PropTypes.number,
    })),
    error: PropTypes.oneOfType([
      PropTypes.null,
      PropTypes.bool,
    ]),
    fetched: PropTypes.bool,
    fetching: PropTypes.bool,
  }),
};

const mapStateToProps = ({ destinations, budget, geo, bar }) => ({
  destinations,
  budget,
  geo,
  bar,
});

export default connect(mapStateToProps, {
  destinationSet,
  browserHistory,
  fetchGeo,
  fetchTerminal,
  fetchHotels,
  flightBudget,
  fetchYelpEvents,
  fetchWeather,
  currentDestination,
  destinationImage,
  fetchViator,
  fetchFrommers,
})(DestinationEntry);
