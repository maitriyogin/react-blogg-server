/**
 * Created by stephenwhite on 01/10/15.
 */
import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setData(state, data) {
    console.log('----- setData, data :'+ JSON.stringify(data, null, 2));
    if(data != null){
            state = setPosts(state, data.get('posts'));

            state = setComments(state, data.get('comments'));

            state = setUsers(state, data.get('users'));
    }
    console.log('----- setData, new state: ' + JSON.stringify(state, null, 2));
    return state;
}

export function setPosts(state, posts) {
    return state.set('posts', List(posts));
}

export function setComments(state, comments) {
    return state.set('comments', List(comments));
}

export function setUsers(state, users) {
    return state.set('users', List(users));
}

export function updateUser(state, user) {
    return state.set('users', utils.updateList(state.get('users'),user));
}

export function updatePost(state, post) {
    return state.set('posts', utils.updateList(state.get('posts'),post));
}

export function updateComment(state, comment) {
    return state.set('comments', utils.updateList(state.get('comments'),comment));
}

export function deleteUser(state, id) {
    return state.set('users', utils.deleteItem(state.get('users'),id));
}

export function deletePost(state, id) {
    return state.set('posts', utils.deleteItem(state.get('posts'),id));
}

export function deletePost(state, id) {
    return state.set('posts', utils.deleteItem(state.get('posts'),id));
}

// utility functions
export const utils = {
    getIndex: (list, id) => {
        return list.findIndex(
                val => {
                    return val.get('_id') == id;
                }
        );
    },
    updateList: (list, item) => {
        let id = item.get('_id');
        if(id > -1) {
            let i = utils.getIndex(list, id);
            if (i > -1) {
                return list.set(i, item);
            }
        } else {
            let id = list.size + 1;
            return list.push(item.set('_id', id));
        }

    },
    deleteItem : (list, id) => {
        let i = utils.getIndex(list, id);
        if(i > -1){
            return list.delete(i);
        } else {
            return list;
        }
    }
};
