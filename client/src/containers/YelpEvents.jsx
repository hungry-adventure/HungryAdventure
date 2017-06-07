import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Scroll from 'react-scroll';
import StarRatingComponent from 'react-star-rating-component';
import { currentEvents } from '../actions/currentStateAction';
import { yelpBudget } from '../actions/budgetAction';
import { eventsImage } from '../actions/budgetBarAction';

const scroll = Scroll.animateScroll;

class YelpEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: ' hide',
      flag: 'See More >>',
      added: [],
    };
  }

  check(index) {
    const first = this.state.added.indexOf(index);
    const last = this.state.added.lastIndexOf(index);
    if (first !== last) {
      this.state.added.splice(first, 1);
      this.state.added.pop();
      this.state[index] = '';
      return '';
    }
    this.state[index] = ' select';
    return ' select';
  }

  add(event, index) {
    this.props.currentEvents({ event });
    this.props.eventsImage({ events: event.image_url });
    setTimeout(() => {
      this.props.yelpBudget(this.props.current);
    }, 1000);
    this.state.added.push(index);
    this.check(index);
  }

  expand() {
    if (this.state.flag === 'See More >>') {
      this.setState({ flag: 'See Less <<' }); this.setState({ show: '' });
    } else {
      this.setState({ flag: 'See More >>' });
      this.setState({ show: ' hide' });
    }
    scroll.scrollMore(500, { delay: 100 });
  }

  render() {
    if (this.props.yelp.events === undefined) {
      return (
        <div />
      );
    }

    return (
      <div className="eventsContainer">
        <Row className="rowTitle">
          <Col md={6} xs={6}><h2>Resturants</h2></Col>
          <Col md={6} xs={6}>
            <div className="seeAll" onClick={() => this.expand()}>{this.state.flag}</div>
          </Col>
        </Row>
        {this.props.yelp.events.map((event, index) => (
          <Col md={3} key={event.image_url} className={`yelpContainer${!this.state[index] ? '' : this.state[index]}${(index > 3) ? this.state.show : ''}`}>
            <div className="portfolio-box" onClick={() => this.add(event, index)}>
              <img alt="" className="eventImg" src={event.image_url} />
              <div className="portfolio-box-caption">
                <span className="glyphicon glyphicon-shopping-cart" />
              </div>
            </div>
            <div className="detailsContainer">
              <span className="infoSpacing price">{event.price}</span>
              <a className="infoSpacing textGrey" href={event.url}>{event.name}</a>
              <span className="infoSpacing textGrey">{event.categories[0].title}</span>
              <div>
                <a className="textGrey" href={event.url}>{event.review_count} Reviews</a>
                <StarRatingComponent
                  name="rating"
                  starCount={5}
                  value={event.rating}
                />
              </div>
            </div>
          </Col>
        ))}
        <div className="spaceMe" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

YelpEvents.defaultProps = {
  current: {
    destination: {},
    hotel: {},
    viatorEvents: [],
    yelpEvents: [],
  },
  yelp: {},
};
YelpEvents.propTypes = {
  currentEvents: PropTypes.func.isRequired,
  eventsImage: PropTypes.func.isRequired,
  yelpBudget: PropTypes.func.isRequired,
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
      neighborhood: PropTypes.string,
      pictures: PropTypes.arrayOf(
        PropTypes.string,
      ),
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
          display_address: PropTypes.arrayOf(
            PropTypes.string,
          ),
          name: PropTypes.string,
          phone: PropTypes.string,
          price: PropTypes.string,
          rating: PropTypes.number,
          review_count: PropTypes.number,
          transactions: PropTypes.arrayOf(
            PropTypes.string,
          ),
          url: PropTypes.string,
        }),
      }),
    ),
  }),
  yelp: PropTypes.shape({
    events: PropTypes.arrayOf(
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
          display_address: PropTypes.arrayOf(
            PropTypes.string,
          ),
          name: PropTypes.string,
          phone: PropTypes.string,
          price: PropTypes.string,
          rating: PropTypes.number,
          review_count: PropTypes.number,
          transactions: PropTypes.arrayOf(
            PropTypes.string,
          ),
          url: PropTypes.string,
        }),
      }),
    ),
  }),
};

export default connect(mapStateToProps, { currentEvents, yelpBudget, eventsImage })(YelpEvents);
