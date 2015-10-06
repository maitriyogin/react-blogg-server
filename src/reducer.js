import * as postDomain from './post-domain';

import data from '../data';

export default function reducer(state = postDomain.INITIAL_STATE, action = {type:'SET_DATA', data:data} ) {
    console.log('***** reducer will : ' + action.type );
    switch (action.type) {
    case 'SET_DATA':
        state = postDomain.setData(state, action.data);
        break;
    case 'RESET_STATE':
        state = postDomain.setData(state, data);
        break;
    case 'UPDATE_POST':
        console.log('---- 3. store calls the reducer with : ' + action.type);
        state = postDomain.updatePost(state, action.post);

        console.log('---- 6. store updates its state from the domain');
        break;
    case 'ADD_COMMENT':
        state = postDomain.updateComment(state, action.comment);
        break;
    case 'UPDATE_POST_TEXT':
        state = postDomain.updatePostText(state, action.postId, action.postText);
        break;
    case 'UPDATE_USER':
        console.log(JSON.stringify(action, null, 2));
        state = postDomain.updateUser(state, action.user);
        break;
    }
    //console.log('***** new state :' + JSON.stringify(state, null, 2) );
    // if the reducer doesn't have the action it just returns the current state.
    return state;
}