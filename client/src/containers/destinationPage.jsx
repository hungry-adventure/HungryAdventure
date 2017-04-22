import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Charts
import DonutChart from 'react-donut-chart';
// +++++ Imported Components
import { Link } from 'react-router-dom';
import { Col, Button, Modal } from 'react-bootstrap';
import GoogleMaps from './GoogleMaps';
import HotelList from '../components/HotelList';
import Weather from '../components/weather';
import FrommersInfo from './FrommersInfo';
import ViatorEvents from './ViatorEvents';
import YelpEvents from './YelpEvents';
import { pinArray } from '../../utils/storyPageHelpers';


class destinationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
     showModal: false,
     title: `${this.props.current.destination.city}, ${this.props.current.destination.country}`,
     info: "",
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  modalInfo(tripInfo) {
    if(tripInfo.city) {
      return (
        <div>
          <h4>Terminal: { tripInfo.originTerminal }</h4>
          <h4>Price: ${ tripInfo.price }</h4>
          <h4>Arrving: { tripInfo.arrivalDate }</h4>
          <h4>Leaving:  {tripInfo.departureDate }</h4>
          <h4><a href={ tripInfo.url } target="_blank">More Info</a></h4>
        </div>
      )
    } else if (tripInfo.hotel) {
      return (
        <div>
          <h4>Hotel: { tripInfo.hotel }</h4>
          <h4>Price: ${ tripInfo.price }</h4>
          <h4>Location: { tripInfo.address }</h4>
          <h4><a href={ tripInfo.url } target="_blank">More Info</a></h4>
        </div>
      )
    } else if (Array.isArray(tripInfo) && tripInfo[0].name) {
        return tripInfo.map((event, i) => (
          <div key={i}>
            <h6>{ event.name }</h6>
            <h6>{ event.categories[0].title }</h6>
            <h6>Price: { event.price }</h6>
            <h6>Rating: { event.rating }</h6>
            <h6><a href={ event.url } target="_blank">More Info</a></h6>
            < br/>
          </div>
        ))
    } else if (Array.isArray(tripInfo) && tripInfo[0].title) {
        return tripInfo.map((event, i) => (
          <div key={i}>
            <h6>{ event.title }</h6>
            <h6>Price: ${ event.price }</h6>
            <h6>Rating: { event.rating }</h6>
            <h6><a href={ event.url } target="_blank">More Info</a></h6>
            < br/>
          </div>
        ))
    }
  }

  open(tripInfo) {
    this.setState({ showModal: true });
    this.setState({ info: this.modalInfo(tripInfo) });
  }

  close() {
    this.setState({ showModal: false });
  }

  loadDestination = () => {
    if(this.props.current.destination.imageUrl.length > 0){
      return <div onClick={ () => this.open(this.props.current.destination) }><img className="circleAdd circleAddDest" style={{ marginTop: '9vw',}} src={this.props.current.destination.imageUrl[0]}></img></div>
    }
    return '';
  }

  loadHotel = () => {
    if(this.props.current.hotel.pictures.length > 0){
      return <div onClick={ () => this.open(this.props.current.hotel) }><img className="circleAdd circleAddHotel" style={{ marginTop: '17vw',}} src={this.props.current.hotel.pictures[0]}></img></div>
    }
    return '';
  }

  loadEvents = () => {
    if(this.props.current.viatorEvents.length > 0){
        return <div onClick={ () => this.open(this.props.current.viatorEvents) }><img className="circleAdd circleAddEvent" style={{ marginTop: "25vw",}} src={this.props.current.viatorEvents[0].image}></img></div>

    }
    return '';
  }

 loadFood = () => {
    if(this.props.current.yelpEvents.length > 0){
        return <div onClick={ () => this.open(this.props.current.yelpEvents) }><img className="circleAdd circleAddFood" style={{ marginTop: "33vw",}} src={this.props.current.yelpEvents[0].image_url}></img></div>
    }
    return '';
  }

  render() {
    const budget = ~~(this.props.budget.original);
    const flightCost = ~~(this.props.budget.flight) || 0;
    const hotelCost = ~~(this.props.budget.hotel) || 0;
    const activityCost = ~~(this.props.budget.viatorEvents) || 0;
    const foodCost = ~~(this.props.budget.yelpEvents) || 0;
    const totalBudget = ~~(budget - flightCost - hotelCost - activityCost - foodCost);
    const mapArray = pinArray(this.props);

    return (<div>
      <Modal show={ this.state.showModal } onHide={ this.close }>
        <Modal.Header closeButton>
          <Modal.Title>{ this.state.title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.state.info } 
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.close }>Close</Button>
        </Modal.Footer>
      </Modal>

      <Link to="/storypage"><div className="circle"><div className="checkoutbutton glyphicon glyphicon-shopping-cart" /></div></Link>
      {this.loadDestination()}
      {this.loadHotel()}
      {this.loadEvents()}
      {this.loadFood()}
      <div
        className="hero" style={{
          background: `linear-gradient( rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${this.props.destination.imageUrl[0]}) no-repeat center center fixed`,
          height: '60%',
          backgroundSize: 'cover',
        }}
      >
        <div className="titleContainer">
          <div className="mobileTitle">
            <h1>{'Hungry Adventure'}</h1>
            <hr className="pageHr" />
            <p className="pageTitle">
              {this.props.destination.city}, {this.props.destination.country}
            </p>
          </div>
        </div>
      </div>

      <div className="pageContainer">
        <Col sm={4} xs={12} className="weatherPadding mobileSpacing">
          <Weather weather={this.props.weather.weather} destination={this.props.destination} />
        </Col>
        <Col sm={4} xs={12} className="donut mobileSpacing"> <DonutChart
          data={[{ label: `Remaining ( $ ${totalBudget} )`,
            value: totalBudget,
            isEmpty: true,
          },
          { label: ` Hotel ( $ ${hotelCost} )`,
            value: hotelCost },
          { label: ` Flight ( $ ${flightCost} )`,
            value: flightCost },
          { label: `Attractions ( $ ${activityCost} )`,
            value: activityCost },
          { label: `Food ( $ ${foodCost} )`,
            value: foodCost,
          },
          ]} height={200} width={200} legend={false} className="donutAlign"
        /></Col>
        <Col sm={4} xs={12} className="mobileSpacing fromContainer">
          <FrommersInfo frommers={this.props.frommers} />
        </Col>
      </div>

      <Col sm={12} xs={12} className="mapsPadding">
        <div className="maps">
          <GoogleMaps key={Math.random()} locator={this.props.geo.locator} mapArray={mapArray} />
        </div>
      </Col>
      <HotelList hotels={this.props.hotels} destination={this.props.destination} />
      <ViatorEvents />
      <YelpEvents />
      <div className="spaceMe" />
    </div>
    );
  }
}

destinationPage.defaultProps = {
  current: {
    destination: {},
    hotel: {},
    YelpEvents: [],
    ViatorEvents: [],
  },
  budget: { original: '',
    flight: 0,
    hotel: 0,
    loading: false,
    viatorEvents: 0,
    yelpEvents: 0,
  },
  destination: {
    IataCode: '',
    arrivalDate: '',
    carrier: '',
    city: '',
    country: '',
    departureDate: '',
    imageUrl: [],
    price: 0,
  },
  geo: {
    locator: {
      latitude: 0,
      longitude: 0,
    },
    terminal: {
      latitude: 0,
      longitude: 0,
    },
  },
  hotels: {
    hotels: [],
  },
  frommers: {
    description: '',
  },
  weather: {
    weather: {},
  },
};
destinationPage.propTypes = {
  current: PropTypes.shape({
    destination: PropTypes.shape({
      IataCode: PropTypes.string,
      arrivalDate: PropTypes.string,
      carrier: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      departureDate: PropTypes.string,
      imageUrl: PropTypes.arrayOf(PropTypes.string),
      price: PropTypes.number,
    }),
    hotel: PropTypes.shape({
      hotel: PropTypes.string,
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      neighborhood: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string,
      ]),
      pictures: PropTypes.arrayOf(PropTypes.string),
      price: PropTypes.number,
      rating: PropTypes.number,
      url: PropTypes.string,
      address: PropTypes.string,
    }),
    viatorEvents: PropTypes.arrayOf(
      PropTypes.shape({
        count: PropTypes.number,
        image: PropTypes.string,
        price: PropTypes.number,
        rating: PropTypes.number,
        reviews: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
    yelpEvents: PropTypes.arrayOf(
      PropTypes.shape({
        categories: PropTypes.arrayOf(
          PropTypes.shape({
            alias: PropTypes.string,
            title: PropTypes.string,
          }),
        ),
        coordinates: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
        }),
        display_phone: PropTypes.string,
        distance: PropTypes.number,
        id: PropTypes.string,
        image_url: PropTypes.string,
        is_closed: PropTypes.bool,
        location: PropTypes.shape({
          address1: PropTypes.string,
          address2: PropTypes.string,
          address3: PropTypes.string,
          city: PropTypes.string,
          country: PropTypes.string,
          display_address: PropTypes.arrayOf(PropTypes.string),
          name: PropTypes.string,
          phone: PropTypes.string,
          price: PropTypes.string,
          rating: PropTypes.number,
          review_count: PropTypes.number,
          transactions: PropTypes.arrayOf(PropTypes.string),
          url: PropTypes.string,
        }),
      }),
    ),
  }),
  budget: PropTypes.shape({
    flight: PropTypes.number,
    hotel: PropTypes.number,
    loading: PropTypes.bool,
    original: PropTypes.string,
    viatorEvents: PropTypes.number,
    yelpEvents: PropTypes.number,
  }),
  destination: PropTypes.shape({
    IataCode: PropTypes.string,
    arrivalDate: PropTypes.string,
    carrier: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    departureDate: PropTypes.string,
    imageUrl: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number,
  }),
  geo: PropTypes.shape({
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
        establishment: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        googlePlaceId: PropTypes.string,
        neightborhood: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        premise: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        subpremise: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
      }),
      formattedAddress: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      provider: PropTypes.string,
    }),
    terminal: PropTypes.shape({
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
        establishment: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        googlePlaceId: PropTypes.string,
        neightborhood: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        premise: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        subpremise: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
      }),
      formattedAddress: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      provider: PropTypes.string,
    }),
  }),
  hotels: PropTypes.shape({
    hotels: PropTypes.arrayOf(
      PropTypes.shape({
        hotel: PropTypes.string,
        id: PropTypes.number,
        lat: PropTypes.number,
        lng: PropTypes.number,
        neighborhood: PropTypes.oneOfType([
          PropTypes.null,
          PropTypes.string,
        ]),
        pictures: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.number,
        rating: PropTypes.number,
        url: PropTypes.string,
      }),
    ),
  }),
  frommers: PropTypes.shape({
    description: PropTypes.string,
  }),
  weather: PropTypes.shape({
    weather: PropTypes.shape({
      date: PropTypes.string,
      highTemp: PropTypes.number,
      lowTemp: PropTypes.number,
      summary: PropTypes.string,
      timeofDay: PropTypes.string,
    }),
  }),
};

const mapStateToProps = ({ geo, hotels, destination, budget, current, frommers, weather }) => ({
  geo,
  hotels,
  destination,
  budget,
  current,
  frommers,
  weather,
  ...current,
});

export default connect(mapStateToProps, null)(destinationPage);
