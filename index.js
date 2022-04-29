const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 5000

//middleware
app.use(cors());
app.use(express.json());

//user-sajeda
//pass-6pNFwG6Xo391SlVU


const uri = "mongodb+srv://sajeda:6pNFwG6Xo391SlVU@cluster0.vooy9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTacker").collection("notes")

        //get api to read all note 
        //http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const query = { username: "joglu miya" };
            // const query = { name: 'sajeda' };
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //create notes
        // http://localhost:5000/note
        /*
        {
            "username":"oshan",
            "textData":"hello world"
        }
        */

        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log("from post api", data)
            const result = await notesCollection.insertOne(data);
            res.send(result);
        })

        //update notes
        //http://localhost:5000/note/626b794764e866e3364c9405
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("feom update api", data)

            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    ...data
                },
            };

            const result = await notesCollection.updateOne(filter, updateDoc, options);

            res.send(result)
        })

        //delete notes
        //http://localhost:5000/note/626b794764e866e3364c9405
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const result = await notesCollection.deleteOne(query);

            res.send(result)
        })
    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})