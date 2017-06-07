import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// ++++++ Imported Actions
import queryDB from '../actions/facebookAction';
// process.env.FB_CLIENT_ID

// Imported Component
import FacebookLogin, { componentClicked } from '../components/facebookLoginIcon';

class FacebookAuth extends React.Component {

  componentWillMount() {
  // Load Facebook SDK
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1889680274620799';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  responseFacebook(response) {
    this.props.queryDB(response);
  }


  render() {
    if (this.props.fbpicture === undefined) {
      return (<div className="facebookButton">
        <FacebookLogin
          appId="process.env.FB_CLIENT_ID"
          autoLoad
          fields="name,email,picture"
          onClick={componentClicked}
          callback={this.responseFacebook}
          icon="fa-facebook"
        /></div>);
    }
    return (<div>
      <img alt="" className="user" src={this.props.fbpicture} />
    </div>
    );
  }
}

FacebookAuth.defaultProps = {
  fbpicture: '',
};

FacebookAuth.propTypes = {
  queryDB: PropTypes.func.isRequired,
  fbpicture: PropTypes.string,
};

// Connects to store
const mapStateToProps = ({ profile, current }) => ({
  ...profile,
  ...current,
});

export default connect(mapStateToProps, { queryDB })(FacebookAuth);
