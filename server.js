const fs = require('fs');
const path = require('path');

const express = require('express');
const { animals } = require('./data/animals.json')

const PORT = process.env.PORT || 3001;

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json());

// so our code knows to use the public folder content that contains the css and js files that go with the html
// makes the files static resources so front-end code can be accessed without having a specific server enpont created for it
// this middleware creates virtual path, middlewhere function in this case is express.static
app.use(express.static('public'))


function filterByQuery(query,animalsArray){
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
};

function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result; 
}

function validateAnimal(animal){
  if(!animal.name || typeof animal.name !== 'string'){
    return false; 
  };
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  };
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  };
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  };
  return true;
}; 

function createNewAnimal(body, animalsArray){
  const animal = body; 
  animalsArray.push(animal);

  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({animals: animalsArray}, null, 2)
  );
  
  // return finished code to post route for response
  return animal; 
}

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

// to add a route
// get requires two arguments, string desc route, second is callback function executed
app.get('/api/animals',(req,res)=>{
    let results = animals; 
    if (req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results)
});
// the send method(res short for response) to send the string to our client

app.get('/api/animals/:id', (req,res)=>{
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
    
})

//  the '/' brings us to the root route of the server
// this get route has one job, to respond with an html page and display in browser.
// using path to ensure finding correct location for html code
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers',(req,res)=>{
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// wildcard route, incase req is made for route that doesn't exist
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
    console.log(`Example app listening at http://localhost:${PORT}`)
});

