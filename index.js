const genres = require('./routes/genres');
const mongoose = require('mongoose');
const express = require('express');
const app  = express();

app.use(express.json());
app.use('/api/genres', genres);

mongoose.connect('mongodb://localhost:27017/movielib', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('DB Connected'))
    .catch(err=>console.error('Connection failed!',err));


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server running on localhost:${port}`));