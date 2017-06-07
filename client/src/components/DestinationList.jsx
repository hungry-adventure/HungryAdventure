import React from 'react';
import PropTypes from 'prop-types';
import DestinationEntry from './DestinationEntry';


const DestinationList = ({ redirect }) => (
  <div>
    <center>
      <DestinationEntry redirect={redirect} />
    </center>
  </div>
);

DestinationList.propTypes = {
  redirect: PropTypes.func.isRequired,
};

export default DestinationList;
