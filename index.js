const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Running Doctors Portals server!!!!!!!');
})

app.listen(port, () => {
    console.log('The server is running at port: ', port);
})