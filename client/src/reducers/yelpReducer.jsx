export default function reduce(state = {}, action) {
  switch (action.type) {
    case 'FETCH_YELP_FULFILLED' : {
      return { ...state, events: action.payload };
    }
  }
  return state;
}
