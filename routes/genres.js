const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Genre = new mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength:5,
        maxlength:50
    }
}));

/**
 * Send all the genres in json format
 */
router.get('/', async (req, res)=>{
    try{
        const genres = await Genre.find();
        res.send(genres);
    }catch(err){
        console.log('GET Error: ',err.message);
        res.status(404).send('Unable to load genres.');
    }
});

/**
 * Add new genre to the list
 */
router.post('/', async (req, res)=>{
    const { value, error } = validateGenere(req.body);
    if( error ) return(res.status(400).send(`Invalid Request: ${error.details[0].message}`));
    try{
        const genre = new Genre(value);
        await genre.save();
        res.send(value);    
    }catch(err){
        console.log('POST Error:', err.message);
        res.status(404).send('Unable to insert genre.');
    }
});

/**
 * Get a genre
 */
router.get('/:id', async (req, res)=>{
    try{
        const genre = await Genre.findById(req.params.id);
        if(!genre) throw new Error('NULL Returned');
        res.status(200).send(genre);
    }catch(err){
        console.log('GET Error:', err.message);
        return(res.status(404).send(`No Genre with ID: ${req.params.id} found!`));
    }
});

/**
 * Edit a genre
 */
router.put('/:id', async (req, res)=>{
    const { value, error } = validateGenere(req.body);
    if(error) return( res.status(400).send(`Invalid Genre: ${error.details[0].message}`) );
    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id, value, { new: true, useFindAndModify: false});
        if(!genre) throw new Error('NULL Returned');
        res.send(genre);
    }catch(err){
        console.log('PUT Error:', err.message);
        return( res.status(404).send(`No Genre with ID: ${req.params.id} found!`) );
    }
});

/**
 * Delete a genre
 */
router.delete('/:id', async (req, res)=>{
    try{
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if(!genre) throw new Error('NULL Returned');
        res.send(genre);
    }catch(err){
        console.log('DELETE Error: ', err.message);
        return( res.status(404).send(`No Genre with ID: ${req.params.id} found!`));
    }
    
});

/**
 * 
 * @param {JSON Object} genre
 * Validate the Object: 
 * 1. Must have a name field
 * 2. Name must be longer than 2 letters 
 */
function validateGenere(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).alphanum().required()
    });
    return schema.validate(genre)
}

module.exports = router;