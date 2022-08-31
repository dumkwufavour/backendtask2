// write your code here

//importing working modules
//joi version 13.1.0 for error handling

const Joi = require('joi');
const express = require('express');
const { data } = require("./data");
const app = express();

//using express.json for middleware
app.use(express.json());

//root of the application
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

//reading list of data available
app.get('/data', (req, res) => {
    res.send(data);
});

//create new course using post
app.post('/data', (req, res) => {
    //return an error message to user incase if the status is too short and if status property is not given
    //setting requirement for the status property on how the user should enter the status
    const { error } = validateData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const datas = {
        id: data.length + 1,
        status: req.body.status  //referring to status here because it is easy to see from the object
    };
    data.push(datas);
    res.send(datas);
});

//updating the data
app.put('/data/:id', (req, res) => {
    const datas = data.find(c => c.id === parseInt(req.params.id));
    if (!datas) return res.status(404).send('The data with the given ID was not found');
    //const result = validateData(req.body);
    const { error } = validateData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //update data
    datas.status = req.body.status;
    //return the updated data
    res.send(datas);
});

app.delete('/data/:id', (req, res) => {
    //check for the data if it exist
    //if it doesn't exist, return a 404
    const datas = data.find(c => c.id === parseInt(req.params.id));
    if (!datas) return res.status(404).send('The data with the given ID was not found');
    //else delete it
    const index = data.indexOf(datas);
    data.splice(index, 1);
    //return the same data
    res.send(datas);
});

// setting the function to handle errors dynamically
function validateData(data) {
    const schema = {
        status: Joi.string().required() //referring to status here because it is easy to see from the object
    };
    return Joi.validate(data, schema);
};

// reading id of a data
app.get('/data/:id', (req, res) => {
    const datas = data.find(c => c.id === parseInt(req.params.id));
    if (!datas) return res.status(404).send('The data with the given ID was not found');
    res.send(datas);
});

//environment port variable set at 3000 if it's not available use 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

