const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json());
// so our code knows to use the public folder content that contains the css and js files that go with the html
// makes the files static resources so front-end code can be accessed without having a specific server enpont created for it
// this middleware creates virtual path, middlewhere function in this case is express.static
app.use(express.static('public'))

// Use Api Routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
    console.log(`Example app listening at http://localhost:${PORT}`)
});

