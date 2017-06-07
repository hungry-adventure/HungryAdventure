import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { fetchDestinations } from '../actions/destinationsAction';
import DestinationList from '../components/DestinationList';
import Search from './searchForm';
import { saveSearchQuery } from '../actions/saveSearchQueryAction';
import Auth from './FacebookAuth';
import { reset } from '../actions/resetState';
import { getBudget, resetBudget } from '../actions/budgetAction';
import { getGoogleData } from '../actions/userLocationAction';


class Destinations extends Component {
  static getRandomInt(min, max) {
    const minCopy = Math.ceil(min);
    const maxCopy = Math.floor(max);
    return Math.floor(Math.random() * (maxCopy - minCopy)) + minCopy;
  }

  constructor(props) {
    super(props);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
    this.props.resetBudget();


    if (Object.keys(this.props.budget).length === 0) {
      if (window.location.search) {
        let queryString = window.location.search;
        queryString = queryString.substring(1);

        const parseQueryString = (q) => {
          const params = {};
          // Split into key/value pairs
          const queries = q.split('&');
          let temp;
          let i;
          let l;
      // Convert the array of strings into an object
          for (i = 0, l = queries.length; i < l; i += 1) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
          }
          return params;
        };
        const queryObj = {
          Budget: parseQueryString(queryString).Budget,
          departDate: new Date((parseQueryString(queryString).departDate).replace(/%20/g, ' ')),
          arrivalDate: new Date((parseQueryString(queryString).arrivalDate).replace(/%20/g, ' ')),
        };
        this.props.getBudget(queryObj);
        this.props.fetchDestinations(queryObj);
      }
    }
  }

  submit(values) {
    this.props.getBudget(values);
    this.props.fetchDestinations(values).then(() => {
      this.props.history.push(`/flights?Budget=${values.Budget}&departDate=${values.departDate}&arrivalDate=${values.arrivalDate}`);
    });
  }

  loadingStatus() {
    if (this.props.destinations.fetching) {
      return true;
    }
    return false;
  }


  randomSlogan() {
    const funFacts =
      ['Did you know London, England draws more international visitors than any other city on the planet?',
        'Did you know that 40 per cent of the New York subway system is above ground, and it runs 24 hours a day?',
        'San Francisco’s famous suspension bridge isn’t actually gold; its official paint colour is ‘international orange.’ Goldengatebridge.org even publicizes the colour formula used to attain this orange hue, so fans of the bridge can replicate the exact tone at home. The bridge owes its golden name to the Golden Gate Strait, the waterway it straddles, not its paint colour.',
        'Pacific Rim tourists susceptible to vertigo, be warned. Hong Kong’s skyline features more skyscrapers than New York City.',
        'If you’re referring to the tower in London’s Houses of Parliament as Big Ben, try again. According to the UK Parliament’s website, the tower is officially called the Clock Tower. Big Ben is the nickname for the clock’s bell.',
        'Don’t forget your swimsuit and snorkel; life really is a beach in Australia. The country lays claim to over 10,000 beaches – more than any other nation.',
        'Reaching triumphantly skyward over the waters of New York City’s harbour, the Statue of Liberty is one of America’s most beloved attractions. But surprisingly, this iconic American landmark began her life in Europe. Built by French sculptor Auguste Bartholdi, the Statue took nine years to complete and was shipped via boat from France to New York City in 350 individual pieces.',
        'Arizona’s steep canyon is certainly grand, but it’s not the world’s largest. Tibet’s Tsangpo Canyon actually holds the title as the planet’s biggest, deepest canyon. The Grand Canyon is the runner-up.',
        'According to the City of Niagara Falls, over 6 million cubic feet of water hurls over the top of Canada’s Horseshoe Falls every minute – enough to fill a million bathtubs to the brim in 60 seconds. But once in March 1848, the water actually stopped flowing. A temporary obstruction at the mouth of the Niagara River in Fort Erie, Ontario caused the roaring cascade of water to shrink to a quiet trickle.'];

    return funFacts[this.getRandomInt(0, funFacts.length)];
  }


  render() {
    if (this.props.destinations.fetched === false) {
      return (<div className="loadingScreen">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title><h1><center>DID YOU KNOW?</center></h1></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="loadingText"> {this.randomSlogan()} </div>
          </Modal.Body>
          <Modal.Footer>
            <div><center>
              <img alt="" className="loadingImg" src="../../assets/loading.gif" />
            </center>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </div>

      );
    } else if (this.props.destinations.destinations.length === 0) {
      return (
        <div>
          <Search onSubmit={this.submit} />
          <Auth />
          <section id="banner">
            <h2>No Search Results.</h2>
            <p>Please try again</p>
          </section>
        </div>
      );
    }
    return (<div className="supreme-container">
      <Search onSubmit={this.submit} />
      <Auth />
      <section id="banner">
        <h2>{'Hungry Adventure'}</h2>
        <p>{'Let\'s go on an adventure'}</p>
      </section>
      <section className="customContainer">
        <Modal show={this.loadingStatus()}>
          <Modal.Header>
            <Modal.Title><h1><center>DID YOU KNOW?</center></h1></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="loadingText"> {this.randomSlogan()} </div>
          </Modal.Body>
          <Modal.Footer>
            <div><center>
              <img alt="" className="loadingImg" src="../../assets/loading.gif" />
            </center>
            </div>
          </Modal.Footer>
        </Modal>
        <DestinationList
          destinations={this.props.destinations}
          redirect={(url) => { this.props.history.push(url); }}
        />
      </section>
    </div>
    );
  }
}

Destinations.defaultProps = {
  budget: { original: '',
    flight: 0,
    hotel: 0,
    loading: false,
    viatorEvents: 0,
    yelpEvents: 0,
  },
  destinations: { destinations: [] },
};

Destinations.propTypes = {
  resetBudget: PropTypes.func.isRequired,
  getBudget: PropTypes.func.isRequired,
  fetchDestinations: PropTypes.func.isRequired,
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
    error: PropTypes.bool,
    fetched: PropTypes.bool,
    fetching: PropTypes.bool,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ destinations, budget }) => ({
  destinations,
  budget,
});

export default connect(mapStateToProps, {
  fetchDestinations,
  saveSearchQuery,
  reset,
  getBudget,
  resetBudget,
  getGoogleData,
})(Destinations);
