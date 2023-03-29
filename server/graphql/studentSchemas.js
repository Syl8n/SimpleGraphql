var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var StudentModel = require('../model/Student');

const studentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            firstName: {
                type: GraphQLString
            },
            lastName: {
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            college: {
                type: GraphQLString
            },
            program: {
                type: GraphQLString
            },
            startingYear: {
                type: GraphQLInt
            }
        }
    }
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            students: {
                type: new GraphQLList(studentType),
                resolve: function () {
                    const students = StudentModel.find().exec()
                    if (!students) {
                        throw new Error('Error')
                    }
                    return students
                }
            },
            student: {
                type: studentType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const studentInfo = StudentModel.findById(params.id).exec()
                    if (!studentInfo) {
                        throw new Error('Error')
                    }
                    return studentInfo
                }
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addStudent: {
                type: studentType,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    college: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    program: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    startingYear: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    const studentModel = new StudentModel(params);
                    const newStudent = studentModel.save();
                    if (!newStudent) {
                        throw new Error('Error');
                    }
                    return newStudent
                }
            },
            updateStudent: {
                type: studentType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    college: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    program: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    startingYear: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }

                },
                resolve(root, params) {
                    return StudentModel.findByIdAndUpdate(params.id, {
                        firstName: params.firstName,
                        lastName: params.lastName, email: params.email, college: params.college,
                        program: params.program, startingYear: params.startingYear
                    }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            deleteStudent: {
                type: studentType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const deletedStudent = StudentModel.findByIdAndRemove(params.id).exec();
                    if (!deletedStudent) {
                        throw new Error('Error')
                    }
                    return deletedStudent;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
