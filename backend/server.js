const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");


const app = express();
app.use(express.json());
app.use(cors());

// app.post("/users",(req,res) => {
//     console.log(req.body);

//     res.send("Data received");
// })

// app.listen("5000",() => {
//     console.log("Server running on port 5000");
// })

const client = new MongoClient("mongodb://localhost:27017/");

async function startServer() {
    await client.connect();

    console.log("Node js connected to Mongodb");

    const db = client.db("learning");
    const userCollection = db.collection("users");

    app.post("/users", async (req,res) => {
        const userData = req.body;

        const result = await userCollection.insertOne(userData);

        console.log("user saved :", result.insertedId);
        res.send("User saved successfully");
    })



    app.post("/login",async (req,res)=> {
        const loginData = req.body;
        
        console.log("Loign Request :", loginData);

        const user = await userCollection.findOne({
            userName : loginData.userName,
            password : loginData.password
        })

        if(user) {
            res.send("Login Successful");
        }else {
            res.send("Invalid userName or password");
        }
    })

    app.listen(5000, ()=> {
        console.log("server connected to port 5000");
    })
}
startServer();