const mongoose = require("mongoose");
const allProject = require("./models/allProjects");  
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


let projects = [
    {
        username : "Ujjawal Jaiswal",
        erp_id : 231181,
        title : "Tic Tac Toe",
        description : "A very Good Game",
        link : "https://ujjawal103.github.io/Tic-Tac-Toe/",
        imagePath : "/images/Screenshot 2024-12-08 123700.png",
        created_at : new Date()
    },
    {
        username : "vikas Tiwari",
        erp_id : 231182,
        title : "Rock Paper Scissor",
        description : "A very Good Game sun rhe ho",
        link : "https://ujjawal103.github.io/Stone-Paper-Scissor/",
        imagePath : "/images/Screenshot 2024-12-08 123717.png",
        created_at : new Date()
    },
    {
        username : "Dhiru Singh",
        erp_id : 231183,
        title : "Login page",
        description : "A very Good Game kyu nhi aa rha ",
        link : "https://dhiruu021.github.io/login-page/",
        imagePath : "/images/Screenshot 2024-12-08 123733.png",
        created_at : new Date()
    },
    {
        username : "Satyam Raj",
        erp_id : 231189,
        title : "Music System",
        description : "A very Good Game btao ",
        link : "https://satyam4755.github.io/Music_section/",
        imagePath : "/images/Screenshot 2024-12-08 123752.png",
        created_at : new Date()
    },
    {
        username : "Ujjawal Jaiswal",
        erp_id : 231181,
        title : "Code Rooms",
        description : "Say GoodBye To Printing Notes For Exam . Get free notes for semester",
        link : "https://ujjawal103.github.io/Code-Rooms/",
        imagePath : "/images/Screenshot 2024-12-08 152405.png",
        created_at : new Date()
    },
];

allProject.insertMany(projects);