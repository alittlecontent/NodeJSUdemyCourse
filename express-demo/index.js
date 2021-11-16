const Joi = require('joi');
const express = require('express');
// represents application
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]

app.get('/',(req,res) => {
    res.send('Hello WOrld!!');
})

app.get('/api/courses',(req,res) => {
    res.send([1,2,3,4,5,7]);
})

app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) res.status(404).send('The course with this id wasn\'t found');
})

app.post('/api/courses',(req,res) => {
    const { error } = validateCourse(req.body);
    if(error)
        res.status(400).send(error.details);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id',(req,res) => {
    // Find course, if not found - return 404 not found
    const course = courses.find(x => x.id === parseInt(req.body.id));
    if(!course) return res.status(404).send('No such course exists.');

    // Course 
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details);

    course.name = req.body.name;

    res.send(course);
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course.body,schema);
}

app.delete('/api/courses/:id',(req,res) => {
    const course = courses.find(x => x.id === parseInt(req.body.id));
    if(!course) return res.status(404).send('no such course exists.');
        
    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));