import {Map, fromJS, List} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

import data from '../data';

describe('store', () => {

  let store = null;

  before('has an initial state', () => {
    store = makeStore();
    // setup initial data
    console.log('*** Dispatch Set data');
    store.dispatch({
      type: 'SET_DATA',
      data: data
    });
  });

  it('can update an existing post', (done) => {
    const updatePostAction = {
      type: 'UPDATE_POST',
      post: Map({_id: 1, title: 'Stephens Blog', body: 'Ember Rocks!', user: 1, comments: List.of(1, 2)})
    }

    console.log('---- 1. client sends an UPDATE_POST');

    store.subscribe(
      () => {
        console.log('---- 7. on subscription of a state change the server emits a state event');
        const newState = store.getState();
        expect(newState.get('posts').get(0).get('body')).to.equal('Ember Rocks!');
        console.log('---- 8. client receives a new state : ' + JSON.stringify(newState, null, 2));
        done();
      });

    console.log('---- 2. server dispatches action to store');
    store.dispatch(updatePostAction);



  });

});