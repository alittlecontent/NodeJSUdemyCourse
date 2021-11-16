const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`))

var genres = [
    {
        id: 1,
        name: "horror"
    },
    {
        id: 2,
        name: "comedy"
    },
    {
        id: 3,
        name: "scifi"
    }
]

app.get('/api/genres',(req,res) => {
    res.send(genres);
})

app.get('/api/genres/:genre',(req,res) => {
    const genre = genres.find(g => g.name === req.params.genre);
    if(!genre) return res.status(404).send('No such genre exists');

    res.send(genre);
})

app.post('/api/genres',(req,res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre);

    res.send(genre);
})

app.put('/api/genres/:genre',(req,res) => {
    const genre = genres.find(g => g.name === req.params.genre);
    if(!genre) return res.status(404).send('No such genre exists');
    
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error);

    const index = genres.indexOf(genre);
    genres[index].name = req.body.name;

    res.send(genre);
})

app.delete('/api/genres/:genre',(req,res) => {
    const genre = genres.find(g => g.name === req.params.genre);
    if(!genre) return res.status(404).send('No such genre exists');
    
    genres.splice(genres.indexOf(genre),1);

    res.send(genre);
})

function validateGenre(genre) {
    const schema = {
        "id": Joi.number(),
        "name": Joi.string().required()
    }
    return Joi.validate(genre,schema);
}
