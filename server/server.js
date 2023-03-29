process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongooseConfig = require('./config/mongoose'),
    expressConfig = require('./config/express'),
    { graphqlHTTP } = require('express-graphql'),
    schema = require('./graphql/studentSchemas'),
    cors = require('cors'),
    port = 5000;

const db = mongooseConfig(),
    app = expressConfig();


app.use('*', cors());
app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true,
}));

app.listen(port, () => console.log(`Express GraphQL Server Now Running On http://localhost:${port}/graphql`));

module.exports = app;