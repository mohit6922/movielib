const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Romance' },
    { id: 3, name: 'Commedy' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Thriller' },
    { id: 6, name: 'Suspense' }
];

/**
 * Send all the genres in json format
 */
router.get('/', (req, res)=>{
    res.status(200).send(genres);
});

/**
 * Add new genre to the list
 */
router.post('/', (req, res)=>{
    const { error } = validateGenere(req.body);
    if( error ) return(res.status(400).send(`Invalid Request: ${error.details[0].message}`));

    const genre = {
        id: genres.length+1,
        name: req.body.name
    };
    genres.push(genre);
    res.status(200).send(genre);
});

/**
 * Get a genre
 */
router.get('/:id', (req, res)=>{
    const genre = genres.find(g => (g.id === parseInt(req.params.id)));
    if(!genre)  return(res.status(404).send(`No Genre with ID: ${req.params.id} found!`));
    res.status(200).send(genre);
});

/**
 * Edit a genre
 */
router.put('/:id', (req, res)=>{
    const genre = genres.find(g => (g.id === parseInt(req.params.id)) );
    if(!genre) return( res.status(404).send(`No Genre with ID: ${req.params.id} found!`) );

    const { error } = validateGenere(req.body);
    if(error) return( res.status(400).send(`Invalid Genre: ${error.details[0].message}`) );

    genre.name = req.body.name;
    res.status(200).send(genre);

});

/**
 * Delete a genre
 */
router.delete('/:id', (req, res)=>{
    const genre = genres.find(g => ( g.id === parseInt(req.params.id) ));
    if (!genre) return( res.status(404).send(`No Genre with ID: ${req.params.id} found!`));

    genres.splice(genres.indexOf(genre), 1);
    res.status(200).send(genre);
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