const winston = require('winston');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = function(){
    mongoose.connect('mongodb://localhost:27017/movielib', { useUnifiedTopology: true })
    .then(winston.info('Connected to Database'));  
}