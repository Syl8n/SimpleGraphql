var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var StudentModel = require('../model/Student');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const config = require('../config/config');

const studentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString,
            },
            firstName: {
                type: GraphQLString
            },
            lastName: {
                type: GraphQLString
            },
            program: {
                type: GraphQLString
            },
            courses: {
                type: GraphQLString,
            },
            token: {
                type: GraphQLString,
            },
        }
    }
});

const queryType = {
    students: {
      type: new GraphQLList(studentType),
      resolve: function () {
        const students = StudentModel.find().exec();
        if (!students) {
          throw new Error("Error");
        }
        return students;
      },
    },
};

const Mutation = {
    signUp: {
      type: studentType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
        program: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (root, params) => {
        const hashed = await bcrypt.hash(params.password, 10);
  
        const studentModel = new StudentModel({
          ...params,
          password: hashed,
        });
  
        const newStudent = studentModel.save();
        if (!newStudent) {
          throw new Error("Error");
        }
        return jwt.sign({ id: newStudent._id }, config.jwtSecret);
      },
    },
  
    signIn: {
      type: studentType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (root, params) => {
        console.log("password", params.password);
        const user = await StudentModel.findOne({
          _id: params.id,
        }).exec();
        console.log("user", user);
        if (!user) {
          throw new Error("Error");
        }
  
        const valid = await bcrypt.compare(params.password, user.password);
  
        if (!valid) {
          throw new Error("Error signing in");
        }
        const tk = jwt.sign({ id: user._id }, config.jwtSecret);
        console.log(tk);
        return { token: tk };
      },
    },
  
    updateUserCourse: {
      type: studentType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        course: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (root, params) => {
        const user = await StudentModel.findOneAndUpdate(
          {
            _id: params.id,
          },
          {
            $addToSet: { courses: params.course },
          }
        ).exec();
  
        if (!user) {
          throw new Error("Error");
        }
  
        return user;
      },
    },
  
    deleteUserCourse: {
      type: studentType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        course: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (root, params) => {
        const user = await StudentModel.findOneAndUpdate(
          {
            _id: params.id,
          },
          {
            $pull: { courses: params.course },
          }
        ).exec();
  
        if (!user) {
          throw new Error("Error");
        }
  
        return user;
      },
    },
};

module.exports = {
    studentQuery: queryType,
    studentMutation: Mutation,
};
