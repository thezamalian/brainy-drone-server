const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const database = client.db('brainyDrone');
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const featureCollection = database.collection('features');
        const orderCollection = database.collection('allOrders');
        const adminCollection = database.collection('allAdmins');

        // GET API - ALL PRODUCTS
        app.get("/products", async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();

            // console.log(products);
            res.send(products);
        })
        // GET API - single PRODUCT
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            console.log('getting a specific product');

            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);

            // console.log(products);
            res.send(product);
        })
        // GET API - ALL features
        app.get("/features", async (req, res) => {
            const cursor = featureCollection.find({});
            const features = await cursor.toArray();

            res.send(features);
        })
        // GET API - ALL reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();

            res.send(reviews);
        })
        // GET API - ALL orders
        app.get("/orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();

            console.log("All orders has been loaded.");
            res.send(orders);
        })
        // GET API - My orders
        app.get("/my-orders/:email", async (req, res) => {
            const email = req.params.email;

            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();

            console.log(email);
            const myOrders = orders.filter(order => order.user.email === email);

            console.log("My orders has been loaded.");
            res.send(myOrders);
        });
        // GET API - ALL Admins
        app.get("/admins", async (req, res) => {
            const cursor = adminCollection.find({});
            const admins = await cursor.toArray();

            console.log("All admins has been loaded.");
            res.send(admins);
        })
        // /////////////////////////////////////////

        // POST API - BOOK an order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log("Hit the post api ", order);

            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })
        // POST API - add product
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log("Hit the post api ", product);

            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result);
        })
        // POST API - add review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log("Hit the post api ", review);

            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result);
        })
        // POST API - make admin
        app.post('/admins', async (req, res) => {
            const admin = req.body;
            console.log("Hit the post api ", admin);

            const result = await adminCollection.insertOne(admin);
            console.log(result);
            res.json(result);
        })

        // ----------------------------
        // UPDATE API - update an order's status
        app.put('/orders/:id', async (req, res) => {
            // console.log(updatedOrder);
            const id = req.params.id;
            const updatedOrder = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    isPending: updatedOrder.isPending
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);

            res.json(result)
        });

        // DELETE API - delete an order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });
        // DELETE API - delete a PRODUCT
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await productCollection.deleteOne(query);
            res.json(result);
        });
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