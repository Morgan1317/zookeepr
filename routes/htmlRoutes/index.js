const path = require('path');
const router = require('express').Router();

//  the '/' brings us to the root route of the server
// this get route has one job, to respond with an html page and display in browser.
// using path to ensure finding correct location for html code
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// wildcard route, incase req is made for route that doesn't exist
router.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router; 