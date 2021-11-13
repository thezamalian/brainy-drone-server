const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwjoa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('DB connected successfully');
    }
    finally {
        // await client.close(); 
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Brainy Drone server!!!!!!!');
})

app.listen(port, () => {
    console.log('The server is running at port: ', port);
})