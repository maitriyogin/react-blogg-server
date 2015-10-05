/**
 * Created by stephenwhite on 01/10/15.
 */
import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setData, setPosts, setComments, setUsers, utils, updateUser, deleteUser} from '../src/post-domain';

import data from '../data';

describe('application logic', () => {

    describe('posts', () => {

        it('adds the posts to the state', () => {
            const state = Map();
            const posts = List.of(Map({'_id':'1', 'title':'Stephens Blog', 'body':'React Rocks!'}), Map({'_id':'2', 'title':'Jonases Blog', 'body':'Angular Rocks!'}));
            const nextState = setPosts(state, posts);
            expect(nextState).to.equal(Map({
                posts: List.of(Map({'_id':'1', 'title':'Stephens Blog', 'body':'React Rocks!'}), Map({'_id':'2', 'title':'Jonases Blog', 'body':'Angular Rocks!'}))
            }));
        });

    });

    describe('comments', () => {

        it('adds the comments to the state', () => {
            const state = Map();
            const date = new Date();
            const comments = List.of(
                Map({'_id':'1', 'body':'A framework for creating nice applications', 'date':date, 'post':'1', 'user': '1'}),
                Map({'_id':'2', 'body':'transclude my transclusion ...', 'date':date, 'post':'2', 'user': '2'}));
            const nextState = setComments(state, comments);
            expect(nextState).to.equal(Map({
                comments: List.of(
                    Map({'_id':'1', 'body':'A framework for creating nice applications', 'date':date, 'post':'1', 'user': '1'}),
                    Map({'_id':'2', 'body':'transclude my transclusion ...', 'date':date, 'post':'2', 'user': '2'}))
            }));
        });

    });

    describe('users', () => {

        it('adds the users to the state', () => {
            const state = Map();
            const users = List.of(
                Map({'_id':'1','username' : 'stephen','email':'stephen.white@callistaenterprise.se', 'posts' : List.of('1'), 'comments' : List.of('3', '4')}),
                Map({'_id':'2','username' : 'sedina','email':'sedina.oruc@callistaenterprise.se', 'posts': List.of('2'), 'comments' : List.of('5', '6')}),
                Map({'_id':'3','username' : 'jonas','email':'jonas.behmer@callistaenterprise.com', 'posts': List.of('3'), 'comments' : List.of('1', '2')})
             );
            const nextState = setUsers(state, users);
            expect(nextState).to.equal(Map({
                users: List.of(
                    Map({'_id':'1','username' : 'stephen','email':'stephen.white@callistaenterprise.se', 'posts' : List.of('1'), 'comments' : List.of('3', '4') } ),
                    Map({'_id':'2','username' : 'sedina','email':'sedina.oruc@callistaenterprise.se', 'posts': List.of('2'), 'comments' : List.of('5', '6')}),
                    Map({'_id':'3','username' : 'jonas','email':'jonas.behmer@callistaenterprise.com', 'posts': List.of('3'), 'comments' : List.of('1', '2')})
                )}));
        });

       it('can update a user in the state', () =>{
           const users = List.of(
               Map({_id:1,username : 'stephen',email:'stephen.white@callistaenterprise.se', posts : List.of(1), comments : List.of(3, 4)}),
               Map({_id:2,username : 'sedina',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)}),
               Map({_id:3,username : 'jonas',email:'jonas.behmer@callistaenterprise.com', posts: List.of(3), comments : List.of(1, 2)})
           );
           const state = Map({users:users});
           let usersList = state.getIn(['users']);

           let sedinaUpdate = Map({_id:2,username : 'sedina oruc',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)});

           let i = utils.getIndex(usersList, 2);

           //console.log('index: ' + i);

           let ul = utils.updateList(usersList, sedinaUpdate);

           expect(ul.get(1).get('username')).to.equal('sedina oruc');
           expect(ul).to.not.equal(usersList);
       })

        it('can push a new user', () =>{
            const users = List.of(
                Map({_id:1,username : 'stephen',email:'stephen.white@callistaenterprise.se', posts : List.of(1), comments : List.of(3, 4)}),
                Map({_id:2,username : 'sedina',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)}),
                Map({_id:3,username : 'jonas',email:'jonas.behmer@callistaenterprise.com', posts: List.of(3), comments : List.of(1, 2)})
            );
            const state = Map({users:users});
            let usersList = state.getIn(['users']);

            let user = Map({username : 'fred bloggs',email:'fred.bloggs@callistaenterprise.se', posts: List.of(), comments : List.of()});

            let ul = utils.updateList(usersList, user);

            expect(ul.get(3).get('username')).to.equal('fred bloggs');
            expect(ul.get(3).get('_id')).to.equal(4);
            expect(ul.size).to.equal(4);
        })

        it('can update the state with a user', () =>{
            const users = List.of(
                Map({_id:1,username : 'stephen',email:'stephen.white@callistaenterprise.se', posts : List.of(1), comments : List.of(3, 4)}),
                Map({_id:2,username : 'sedina',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)}),
                Map({_id:3,username : 'jonas',email:'jonas.behmer@callistaenterprise.com', posts: List.of(3), comments : List.of(1, 2)})
            );

            let state = Map({});

            state = setUsers(state,users);

            let user = Map({username : 'fred bloggs',email:'fred.bloggs@callistaenterprise.se', posts: List.of(), comments : List.of()});

            let newState = updateUser(state, user);

            let ul = newState.getIn(['users']);

            ////console.log('new user list : ' + JSON.stringify(ul, null, 2));

            expect(ul.get(3).get('username')).to.equal('fred bloggs');
            expect(ul.get(3).get('_id')).to.equal(4);
            expect(ul.size).to.equal(4);
        })

        it('can create a new empty user', () =>{
            const users = List.of(
              Map({_id:1,username : 'stephen',email:'stephen.white@callistaenterprise.se', posts : List.of(1), comments : List.of(3, 4)}),
              Map({_id:2,username : 'sedina',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)}),
              Map({_id:3,username : 'jonas',email:'jonas.behmer@callistaenterprise.com', posts: List.of(3), comments : List.of(1, 2)})
            );

            let state = Map({});

            state = setUsers(state,users);

            let user = null;

            let newState = updateUser(state, user);

            let ul = newState.getIn(['users']);

            ////console.log('new user list : ' + JSON.stringify(ul, null, 2));

            expect(ul.get(3).get('username')).to.equal('');
            expect(ul.get(3).get('email')).to.equal('');
            expect(ul.get(3).get('_id')).to.equal(4);
            expect(ul.size).to.equal(4);
        })

        it('can delete a user from the state', () =>{
            const users = List.of(
                Map({_id:1,username : 'stephen',email:'stephen.white@callistaenterprise.se', posts : List.of(1), comments : List.of(3, 4)}),
                Map({_id:2,username : 'sedina',email:'sedina.oruc@callistaenterprise.se', posts: List.of(2), comments : List.of(5, 6)}),
                Map({_id:3,username : 'jonas',email:'jonas.behmer@callistaenterprise.com', posts: List.of(3), comments : List.of(1, 2)})
            );

            let state = Map({});

            state = setUsers(state,users);

            let newState = deleteUser(state, 2);

            let ul = newState.getIn(['users']);

            expect(ul.get(1).get('username')).to.equal('jonas');
            expect(ul.get(1).get('_id')).to.equal(3);
            expect(ul.size).to.equal(2);
        })

    });

    describe('data', () => {
        it('adds all the data to the state', () => {
            const state = Map();
            const nextState = setData(state, data);
            expect(nextState.has('posts')).to.be.true;
            expect(nextState.has('comments')).to.be.true;
            expect(nextState.has('users')).to.be.true;
        });
    });
});
