import {createStore} from 'redux';
import reducer from './reducer';

// the store contains our current state tree
export default function makeStore() {
    return createStore(reducer);
}