const redux = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const axios = require('axios');

const { createStore, applyMiddleware } = redux;

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  }
}

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
    error: ''
  }
}

const fetchUsersFailure = (msg) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: msg
  }
}

const initialState = {    
  loading: false,
  users: [],
  error: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: false
      }
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: true,
        users: action.payload,
        error: ''
      }
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: true,
        users: [],
        error: action.payload
      }
    default:
      return state;
  }
}

const fetchUsers = () => {
  return function(dispatch) {
    const url = 'https://jsonplaceholder.typicode.com/users';
    dispatch(fetchUsersRequest());
    axios.get(url)
    .then(response => {
      const users = response.data.map(user => user.id);
      dispatch(fetchUsersSuccess(users));
    })
    .catch(err => {
      dispatch(fetchUsersFailure(err.message));
    });
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

store.subscribe(() => {
  const state = store.getState();
  console.log(state);
});

store.dispatch(fetchUsers());

// store.dispatch(fetchUsersRequest());
// store.dispatch(fetchUsersSuccess([5,5,5]));
// store.dispatch(fetchUsersFailure('Something went wrong'));