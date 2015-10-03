import * as postDomain from './post-domain';

import data from '../data';

export default function reducer(state = postDomain.INITIAL_STATE, action = {type:'SET_DATA', data:data} ) {
    console.log('***** about to :' + action.type );
    switch (action.type) {
    case 'SET_DATA':
        state = postDomain.setData(state, action.data);
        break;
    case 'UPDATE_POST':
        state = postDomain.updatePost(state, action.post);
        break;
    case 'ADD_COMMENT':
        state = postDomain.updateComment(state, action.comment);
        break;
    }
    // if the reducer doesn't have the action it just returns the current state.
    return state;
}