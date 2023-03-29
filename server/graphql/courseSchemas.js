var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
const mongoose = require("mongoose");

var CourseModel = require('../model/Course');
var StudentModel = require("../model/Student");

const courseType = new GraphQLObjectType({
    name: 'course',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        section: {
          type: GraphQLString
        },
        semester: {
          type: GraphQLString
        },
      }
    }
  });
  
const queryType = {
  courses: {
    type: new GraphQLList(courseType),
    resolve: function () {
      const courses = CourseModel.find().exec();
      if (!courses) {
        throw new Error("Error");
      }
      return courses;
    },
  },
  myCourses: {
    type: new GraphQLList(courseType),
    args: {
      id: {
        type: GraphQLString,
      },
    },
    resolve: async (root, params) => {
      const user = await StudentModel.findOne({ _id: params.id }).exec();
      const courseIds = user.courses.map((e) => mongoose.Types.ObjectId(e));
      const courses = await CourseModel.find({
        _id: { $in: courseIds },
      }).exec();

      if (!courses) {
        throw new Error("Error");
      }
      return courses;
    },
  },
  otherCourses: {
    type: new GraphQLList(courseType),
    args: {
      id: {
        type: GraphQLString,
      },
    },
    resolve: async (root, params) => {
      const user = await StudentModel.findById( params.id ).exec();
      const courseIds = user.courses.map((e) => mongoose.Types.ObjectId(e));
      const courses = await CourseModel.find({
        _id: { $in: courseIds },
      }).exec();

      if (!courses) {
        throw new Error("Error");
      }
      return courses;
    },
  },
  course: {
    type: courseType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: function (root, params) {
      const courseInfo = CourseModel.findById(params.id).exec();
      if (!courseInfo) {
        throw new Error("Error");
      }
      return courseInfo;
    },
  },
};

const Mutation = {
  createCourse: {
    type: courseType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      semester: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: function (root, params) {
      const courseModel = new CourseModel(params);
      const newCourse = courseModel.save();
      if (!newCourse) {
        throw new Error("Error");
      }
      return newCourse;
    },
  },
  updateCourse: {
    type: courseType,
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      semester: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, params) {
      return CourseModel.findByIdAndUpdate(
        params.id,
        {
          name: params.name,
          section: params.section,
          semester: params.semester,
        },
        function (err) {
          if (err) return next(err);
        }
      );
    },
  },
  deleteCourse: {
    type: courseType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, params) {
      const deletedCourse = CourseModel.findByIdAndRemove(params.id).exec();
      if (!deletedCourse) {
        throw new Error("Error");
      }
      return deletedCourse;
    },
  },
};
  
module.exports = {
  courseQuery: queryType,
  courseMutation: Mutation,
};
