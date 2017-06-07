import React from 'react';
import PropTypes from 'prop-types';

const FrommersInfo = ({ frommers }) => <div>{frommers.description}</div>;

FrommersInfo.defaultProps = {
  frommers: {
    description: '',
  },
};

FrommersInfo.propTypes = {
  frommers: PropTypes.shape({
    description: PropTypes.string,
  }),
};

export default FrommersInfo;
