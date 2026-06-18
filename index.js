const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

const cors = require("cors");
// Middleware
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Import routes
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// MongoDB connection
const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_DB_CONNECTION_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // Access the database and collection
    const database = client.db(process.env.MONGO_DB_NAME);
    // create jobs collection if it doesn't exist
    const jobsCollection = database.collection("jobs");

    // API endpoint to add a new job
    app.post("/api/jobs", async (req,res)=>{
        const job = req.body;
        const result = await jobsCollection.insertOne(job);
        res.send(result);
    })

    // API endpoint to get all jobs by status & companyId
    app.get("/api/jobs", async (req,res)=>{
        const query = {};
        // req.query will contain the query parameters from the URL, e.g., /api/jobs?status=active&companyId=123
        // console.log("Query params: ", req.query);
        if(req.query.status){
            query.status = req.query.status;
        }
        if(req.query.companyId){
            query.companyId = req.query.companyId;
        }
        console.log("Query: ", query);
        const result = await jobsCollection.find(query).toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
