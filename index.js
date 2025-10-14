const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

// user: simpleDBUser
// pass: XorQjmf91j1gL7r4

const uri = "mongodb+srv://simpleDBUser:XorQjmf91j1gL7r4@cluster033.bpxhzqh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster033";

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
        await client.connect();

        const usersCollection = client.db('usersdb').collection('users');

        app.get('/users',async(req,res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/users', async(req, res) => {
            // console.log('data in the server', req.body);
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result)
        })

        app.delete('/users/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('crud server is running')
})
app.listen(port, () => {
    console.log(`server is running on :${port}`,);
})
