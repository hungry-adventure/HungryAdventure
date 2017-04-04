import React from 'react';
import { connect } from 'react-redux';
//++++++ Imported Actions
import { fetchUser } from '../actions/userAction';
import { fetchDestinations } from '../actions/destinationsActions';
import { PageHeader } from 'react-bootstrap';

//Imported Component
import Search from './searchForm';


class Layout extends React.Component {


// fetchDestination = () => {
//   this.props.fetchDestinations()
// }

submit = (values) => {
  console.log('------>', values)
  this.props.fetchDestinations(values).then(() =>{
     this.props.history.push('/flights');
   })

}

  render () {
     return ( <div>
      <center>
      <PageHeader className='pageHeaderBorder'> Hungry Adventure </PageHeader>
      <Search onSubmit={this.submit} />
      </center>
      </div>
    );
  }
}

//Connects to store
const mapStateToProps = ({destinations, user}) => ({
 user: user.user,
 userFetched: user.fetched,
 destinations: destinations.destinations
})

export default connect(mapStateToProps, {fetchUser, fetchDestinations})(Layout);