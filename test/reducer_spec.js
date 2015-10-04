import {Map, fromJS, List} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

import data from '../data';

describe('reducer', () => {

    it('handles SET_DATA', () => {
        const initialState = Map();
        const action = {type: 'SET_DATA', data: data};
        const nextState = reducer(initialState, action);

        expect(nextState.has('posts')).to.be.true;
        expect(nextState.has('comments')).to.be.true;
        expect(nextState.has('users')).to.be.true;

    });


    it('has an initial state', () => {
        const nextState = reducer(undefined, undefined);
        expect(nextState.has('posts')).to.be.true;
        expect(nextState.has('comments')).to.be.true;
        expect(nextState.has('users')).to.be.true;
    });

    it('can update an existing post', () => {
        const action = {
            type: 'UPDATE_POST',
            post: Map({_id: 1, title: 'Stephens Blog', body: 'Angular Rocks!', user: 1, comments: List.of(1, 2)})
        }
        // will init the store with the initial state
        const nextState = reducer(undefined, undefined);
        const us = reducer(nextState, action);
        expect(us.get('posts').get(0).get('body')).to.equal('Angular Rocks!');
    });

    it('can update an existing posts text', () => {
        const action = {
            type: 'UPDATE_POST_TEXT',
            postId: 1,
            postText : 'lovely!'
        }
        // will init the store with the initial state
        const nextState = reducer(undefined, undefined);
        const us = reducer(nextState, action);
        expect(us.get('posts').get(0).get('body')).to.equal('lovely!');
    });

    it('can add a new post', () => {
        const action = {
            type: 'UPDATE_POST',
            post: Map({ title: 'Fred Bloggs', body: 'Angular really does Rock!', user: 1, comments: List.of()})
        }
        // will init the store with the initial state
        const nextState = reducer(undefined, undefined);
        const us = reducer(nextState, action);
        expect(us.get('posts').size).to.equal(4);
        expect(us.get('posts').get(3).get('_id')).to.equal(4);
    });

    it('can add a new comment', () => {
        const action = {
            type: 'ADD_COMMENT',
            comment: Map({body: 'this is a new comment', date: new Date(), post: 1, user: 3})
        }
        // will init the store with the initial state
        const nextState = reducer(undefined, undefined);
        const us = reducer(nextState, action);
        expect(us.get('comments').size).to.equal(7);
        expect(us.get('comments').get(6).get('body')).to.equal('this is a new comment');
    });
});