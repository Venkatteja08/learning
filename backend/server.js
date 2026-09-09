const express = require("express");
const cors = require("cors");
const {MongoClient, ObjectId} = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const JWT_SECRET = "my_secret_key";

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient("mongodb://localhost:27017/");

async function startServer() {
    await client.connect();

    console.log("Node js connected to Mongodb");

    const db = client.db("learning");
    const userCollection = db.collection("users");

    app.post("/users", async (req,res) => {
        // const userData = req.body;

        const userData = {
            userName : req.body.userName,
            password : req.body.password,
            contact : req.body.contact,
            role : "user"
        }
        //changes
        const hashedPassword = await bcrypt.hash(userData.password,10);

        userData.password = hashedPassword;

        const result = await userCollection.insertOne(userData);

        console.log("user saved :", result.insertedId);

        res.send("User saved successfully");
    })



    app.post("/login",async(req,res) => {
        const loginData = req.body;

        const user = await userCollection.findOne({
            userName : loginData.userName
        });

        if(!user) {
            return res.status(401).json({
                message : "Invalid Username or password"
            })
        }

        const passwordMatch = await bcrypt.compare(loginData.password,user.password);

        if (passwordMatch) {
            
            const token = jwt.sign(
                {
                    userId : user._id,
                    userName : user.userName,
                    role : user.role
                },
                JWT_SECRET,
                {
                    expiresIn :"1hr"
                }
            )

            res.json({
                message : "Login Successful",
                token : token
            });

        } else {
            res.status(401).json({
                message : "Invalid username or password"
            })
        }

    })

    function authenticateToken(req,res,next) {
        const authHeader = req.headers['authorization'];

        const token = authHeader && authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).send("Token required"); //unauthori
        }
        try {
            const user = jwt.verify(token,JWT_SECRET);

            console.log("authenticated user :", user);

            req.user = user; 
            next();
        }
        catch(error) {
            return res.status(403).send("Invalid or expired token"); //forbidden
        }
    }

    function authenticateAdmin(req,res,next) {
        if(req.user.role !== "admin") {
            return res.status(403).json({
                message : "admin access required"
            });
        }
        next();
    }



    app.get("/admin",authenticateToken,authenticateAdmin,(req,res) => {
        res.json({
            message : "Welcome Admin",
            user : req.user.userName
        });
    })

    

    app.get("/profile",authenticateToken, async (req,res) => {

        try {

            const user = await userCollection.findOne(
        {
            _id : new ObjectId(req.user.userId) //retriving inf from the database and converting it into objectId as in mongo id is of objectId
        },
        {
            projection : {
                password : 0 // this doesn't send the password to frontend
            }
        }
        );

        if(!user) {
            return res.status(404).json({
                message :"user not found"
            })
        }

        res.status(200).json({
            message : "Access granted",
            // user : req.user //this is taken from the jwt, we are returning which is present in jwt --- now we search in mongodb using id and return that
            user : user
        });

        }catch(error) {
            return res.status(500).json({
                message : "Internal server error"
            })
        }
        
    })

    app.get("/orders", authenticateToken, (req,res) => {
        res.json({
            message : "Orders fetched Succesfully",
            orders : [
                "Laptop","Mobile","Headphones"
            ],
            user : req.user.userName
        })
    })
   
    
    app.listen(5000, ()=> {
        console.log("server connected to port 5000");
    })
}
startServer();