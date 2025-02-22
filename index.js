const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const corsConfig = {
    origin : "*",
    Credential: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
};
app.options("", cors(corsConfig))
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5metfvs.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }


});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productCollection = client.db('productDB').collection('products');
        const cartCollection = client.db('productDB').collection('cartProducts');

        //product section
        app.get('/product', async(req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result =await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/product', async(req, res) =>{
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)}
            const options = {upsert : true}
            const updatedProduct = req.body;

            const product = {
                $set:{
                    imageUrl:updatedProduct.imageUrl,
                    name:updatedProduct.name, 
                    brand:updatedProduct.brand, 
                    type:updatedProduct.type, 
                    price:updatedProduct.price ,
                    rating: updatedProduct.rating
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result)
            
        })

        //cart section

        app.get('/cart', async(req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/cart', async(req, res)=>{
            const newCartProduct = req.body;
            console.log(newCartProduct);
            const result = await cartCollection.insertOne(newCartProduct);
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('tech source server is runnig')
})

app.listen(port, () => {
    console.log(`Tech source server is runnig on port : ${port}`);
})