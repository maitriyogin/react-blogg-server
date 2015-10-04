/**
 * Created by stephenwhite on 01/10/15.
 */
import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setData(state, data) {
    console.log('----- setData, data :');
    if(data != null){
            state = setPosts(state, data.get('posts'));

            state = setComments(state, data.get('comments'));

            state = setUsers(state, data.get('users'));
    }
    console.log('----- setData, new state: ');
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
    return state.set('users', utils.updateList(utils.getList(state,'users'),user));
}

export function updatePost(state, post) {
    return state.set('posts', utils.updateList(utils.getList(state,'posts'),post));
}

export function updateComment(state, comment) {
    let comments = utils.updateList(utils.getList(state,'comments'),comment);
    if(comments == null){
        return state;
    }
    let newState = state.set('comments', comments);
    comment = comments.last();
    // now add the comment to the posts comments fks
    let post = utils.getItem(state, 'posts', comment.get('post'));
    post = post.set('comments', post.get('comments').push(comment.get('_id')));
    newState = updatePost(newState, post);
    console.log('new state after add comment: ' + JSON.stringify(newState, null, 2));
    return newState;
}

export function deleteUser(state, id) {
    return state.set('users', utils.deleteItem(utils.getList(state,'users'),id));
}

export function deletePost(state, id) {
    return state.set('posts', utils.deleteItem(utils.getList(state,'posts'),id));
}

export function deletePost(state, id) {
    return state.set('posts', utils.deleteItem(utils.getList(state,'posts'),id));
}

export function updatePostText(state, postId, text){
    // get the post
    let post = utils.getItem(state,'posts', postId);
    post = post.set('body', text);
    return state.set('posts', utils.updateList(utils.getList(state,'posts'),post));
}

// utility functions
export const utils = {
    getItem : (state,listName, id) => {
        let list = state.get(listName);
        if(list == null){
            return;
        }
        let i = utils.getIndex(list, id);
        return list.get(i);
    },
    getIndex: (list, id) => {
        return list.findIndex(
                val => {
                    return val.get('_id') == id;
                }
        );
    },
    updateList: (list, item) => {
        console.log('------ updateList item:' + Map.isMap(item) + JSON.stringify(item, null, 2));
        if(item == null){
            return list;
        }
        if(!Map.isMap(item)){
            item = Map(item);
        }
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
    },
    getList : (state, listName) => {
        let list = state.get(listName);
        if(list == null || list.size == 0){
            return List.of();
        } else {
            return list;
        }
    }
};
