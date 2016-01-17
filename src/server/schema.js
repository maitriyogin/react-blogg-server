import * as _ from 'underscore';
import moment from 'moment';
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull
} from 'graphql';

// --------------------------------- Adapter
const adapter = require('./adapter')();

// --------------------------------- Types
const User = new GraphQLObjectType({
  name: 'User',
  description: 'Represent the type of a user of a blog post or a comment',
  fields: () => ({
    _id: {type: GraphQLString},
    username: {type: GraphQLString},
    email: {type: GraphQLString},
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args){
        var query = {userfk:parent._id};
        return adapter.find('posts', query).then((posts)=>{
          console.log(JSON.stringify(posts));
          var posts = posts && posts.posts ? posts.posts : null;
          console.log(JSON.stringify(posts));
          return posts;
        })
      }
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve(parent, args){
        var query = {userfk:parent._id};
        return adapter.find('comments', query).then((comments)=>{
          var comments = comments && comments.comments ? comments.comments : null;
          return comments;
        })
      }
    }
  })
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Represent the type of a post',
  fields: () => ({
    _id: {type: GraphQLInt},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    userfk: {type: GraphQLInt},
    user:{
      type:User,
      resolve(parent, args){
        //console.log(JSON.stringify('user args:' + JSON.stringify(parent)));
        return adapter.findById('users', parent.userfk).then((users)=>{
          //console.log(JSON.stringify(users));
          var user = users && users.users && users.users.length > 0 ? users.users[0] : null;
          //console.log(JSON.stringify(user));
          return user;
        })
      }
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve(parent, args){
        var query = {postfk:parent._id};
        return adapter.find('comments', query).then((comments)=>{
          var comments = comments && comments.comments ? comments.comments : null;
          return comments;
        })
      }
    }
  })
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'Represent the type of a Comment on a post of a User',
  fields: () => ({
    _id: {type: GraphQLInt},
    body: {type: GraphQLString},
    updatedate: {type: GraphQLString},
    userfk: {
      name: 'userfk',
      type: GraphQLInt
    },
    postfk: {
      name: 'postfk',
      type: GraphQLInt
    },
    user:{
      type:User,
      resolve(parent, args){
        //console.log(JSON.stringify('user args:' + JSON.stringify(parent)));
        return adapter.findById('users', parent.userfk).then((users)=>{
          //console.log(JSON.stringify(users));
          var user = users && users.users && users.users.length > 0 ? users.users[0] : null;
          //console.log(JSON.stringify(user));
          return user;
        })
      }
    },
    post:{
      type:Post,
      resolve(parent, args){
        return adapter.findById('posts', parent.postfk).then((posts)=>{
          var post = posts && posts.posts && posts.posts.length > 0 ? posts.posts[0] : null;
          return post;
        })
      }
    }
  })
});

// --------------------------------- Queries
const Query = new GraphQLObjectType({
  name: "Queries",
  description:"The queries supported are for users, posts and comments this should live update",
  fields: {
    users: {
      description:"Users query. Arguments supported are _id, username, email.  All String queries are wildcard queries %%",
      type: new GraphQLList(User),
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        username: {
          name: 'username',
          type: GraphQLString
        },
        email: {
          name: 'email',
          type: GraphQLString
        }
      },
      resolve: function(rootValue, args, info) {
        let fields = {};
        let fieldASTs = info.fieldASTs;
        console.log(JSON.stringify(args,null,2))
        fieldASTs[0].selectionSet.selections.map(function(selection) {
          fields[selection.name.value] = 1;
        });
        return adapter.find('users', args).then((users)=>{
          console.log(JSON.stringify(users));
          return users.users;
        })
      }
    },
    posts: {
      description:"Posts query. Arguments supported are _id, title, body, userfk.  All String queries are wildcard queries %%",
      type: new GraphQLList(Post),
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        title: {
          name: 'title',
          type: GraphQLString
        },
        body: {
          name: 'body',
          type: GraphQLString
        },
        userfk: {
          name: 'userfk',
          type: GraphQLInt
        }
      },
      resolve: function(rootValue, args, info) {
        let fields = {};
        let fieldASTs = info.fieldASTs;
        console.log(JSON.stringify(args,null,2))
        fieldASTs[0].selectionSet.selections.map(function(selection) {
          fields[selection.name.value] = 1;
        });
        return adapter.find('posts', args).then((posts)=>{
          console.log(JSON.stringify(posts));
          return posts.posts;
        })
      }
    },
    comments: {
      description:"Comments query. Arguments supported are _id, body.  All String queries are wildcard queries %%",
      type: new GraphQLList(Comment),
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        body: {
          name: 'body',
          type: GraphQLString
        },
        postfk: {type:GraphQLInt},
        userfk: {type:GraphQLInt}
      },
      resolve: function(rootValue, args, info) {
        let fields = {};
        let fieldASTs = info.fieldASTs;
        console.log(JSON.stringify(args,null,2))
        fieldASTs[0].selectionSet.selections.map(function(selection) {
          fields[selection.name.value] = 1;
        });
        return adapter.find('comments', args).then((comments)=>{
          console.log(JSON.stringify(comments));
          return comments.comments;
        })
      }
    }
  }
});

// --------------------------------- Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutations",
  description:"There's some basic mutations for updating/creating a user, updating a post, and adding comments to a post.",
  fields: {
    updateUser: {
      type: User,
      description:"Update user is used to mutate a user.",
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        username: {
          name: 'username',
          type: GraphQLString
        },
        email: {
          name: 'email',
          type: GraphQLString
        }
      },
      resolve: function(rootValue, args) {
        let user = _.clone(args);
        let req = {body:{users:user}};
        return adapter.put('users', null, req).then((auser) => auser);
      }
    },
    createUser: {
      type: User,
      description:"Create user is used to create a user.",
      args: {
        username: {
          name: 'username',
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          name: 'email',
          type: GraphQLString
        }
      },
      resolve: function(rootValue, args) {
        let user = _.clone(args);
        let req = {body:{users:user}};
        return adapter.post('users', null, req).then((auser) => auser);
      }
    },
    updatePost: {
      type: Post,
      description:"Update post is used to update a post",
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        title: {
          name: 'title',
          type: GraphQLString
        },
        body: {
          name: 'body',
          type: GraphQLString
        },
        userfk: {
          name: 'userfk',
          type: GraphQLInt
        },
      },
      resolve: function(rootValue, args) {
        let post = _.clone(args);
        let req = {body:{posts:post}};
        return adapter.put('posts', null, req).then((apost) => apost);
      }
    },
    addComment: {
      type: Comment,
      description:"Add comment is used to ammend comments to a post",
      args: {
        _id: {
          name: '_id',
          type: GraphQLInt
        },
        updatedate: {
          name: 'updatedate',
          type: GraphQLString
        },
        body: {
          name: 'body',
          type: GraphQLString
        },
        userfk: {
          name: 'userfk',
          type: GraphQLInt
        },
        postfk: {
          name: 'postfk',
          type: GraphQLInt
        },
      },
      resolve: function(rootValue, args) {
        let comment = _.clone(args);
        if(!comment.updatedate){
          comment.updatedate = moment().format();
        }
        let req = {body:{comments:comment}};
        return adapter.post('comments', null, req).then((item) => item);
      }
    }
  }
});

const Schema = new GraphQLSchema({
  description:'GraphQL implementation of a basic bloggs schema, users, posts, comments',
  query: Query,
  mutation: Mutation
});

export default Schema;
