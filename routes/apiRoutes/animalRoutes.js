// starts instance of router
const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// to add a route - changed app to router in this case 
// get requires two arguments, string desc route, second is callback function executed
router.get('/animals',(req,res)=>{
    let results = animals; 
    if (req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results)
});
// the send method(res short for response) to send the string to our client

router.get('/animals/:id', (req,res)=>{
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
    
})

router.post('/animals', (req, res) => {
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

module.exports = router; 