const env = require('./env/' + process.env.NODE_ENV + '.js');
module.exports = {
    db: `mongodb+srv://${env.db}.fipwkvw.mongodb.net/?retryWrites=true&w=majority`,
    sessionSecret: 'HenrySuhLab3Ex1SessionSecret'
};