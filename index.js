const express = require('express');
const { MongoClient, ObjectId } = require("mongodb")
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());

// connection to mongodb
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function conndeDB() {
    try {

        const usersCollection = client.db('bakingOven').collection('users');
        const productCollection = client.db('bakingOven').collection('products');
        const reviewCollection = client.db('bakingOven').collection('reviews');
        const orderCollection = client.db('bakingOven').collection('orders');


        // users api
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result)
        });

        // products api
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.send(result)
        });

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const product = req.body;
            const updateProduct = {
                $set: {
                    title: product.title,
                    photoURL: product.photoURL,
                    price: product.price,
                    reting: product.rating,
                    category: product.category,
                    description: product.description,
                }
            }
            const result = await productCollection.updateOne(query, updateProduct, options);
            res.send(result)
            console.log(result)
        })

        // review api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                product: id
            }
            const result = await reviewCollection.find(query).toArray();
            res.send(result)
        });


        // orders api
        app.post('/services', async (req, res) => {
            const products = req.body;
            const result = await orderCollection.insertOne(products);
            res.send(result)
        });

    }
    finally {

    }

}
conndeDB().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Baking Oven is running on the port')
});

app.listen(port, () => {
    console.log(`Baking Oven is running on the port ${port}`)
})

