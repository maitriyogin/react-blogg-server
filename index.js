import makeStore from './src/store';
import startServer from './src/server';

export const store = makeStore();
startServer(store);

// init the store with initial data
store.dispatch({
    type: 'SET_DATA',
    data: require('./data.js')
});
