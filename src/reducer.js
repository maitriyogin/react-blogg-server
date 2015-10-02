import * as postDomain from './post-domain';

import data from '../data';

export default function reducer(state = postDomain.INITIAL_STATE, action = {type:'SET_DATA', data:data} ) {
    switch (action.type) {
    case 'SET_DATA':
        return postDomain.setData(state, action.data);
    case 'UPDATE_POST':
        return postDomain.updatePost(state, action.post);
    }
    // if the reducer doesn't have the action it just returns the current state.
    return state;
}