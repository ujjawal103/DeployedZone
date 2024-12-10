const mongoose = require("mongoose");
const newUser = require("./models/newUser");  
const dotenv = require("dotenv");
dotenv.config();

async function main() {
    await mongoose.connect(process.env.MONGO_URI , {
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
};

main()
.then(res=> console.log("connected to DB"))
.catch(err => console.log(err,"connection lost"));


let users = [
    {
        username : "Ujjawal Jaiswal",
        erp_id : 231181,
        avatar : "/images/7800466039.jpg",
        password : "ujjawal@1234"
    },
    {
        username : "Vikas Tiwari",
        erp_id : 231182,
        avatar : "/images/7607674205.jpg",
        password : "vikas@1234"
    },
    {
        username : "Dhiru Singh",
        erp_id : 231183,
        avatar : "/images/7800337275.jpg",
        password : "dheeraj@1234"
    },
    {
        username : "Satyam Sharma",
        erp_id : 231184,
        avatar : "/images/9621965441.jpg",
        password : "satyam@1234"
    },
    {
        username : "Satyam Raj",
        erp_id : 231189,
        avatar : "/images/9119869107.jpg",
        password : "raj@1234"
    }
]

newUser.insertMany(users);