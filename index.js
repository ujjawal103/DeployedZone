const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/public/images/uploads");  // Folder to temporarily store files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Unique filenames
    },
  });
  
  const validator = require("validator"); //it will check project link(url) is correct or not

  // Middleware for uploading files
  const upload = multer({ storage });


  const cloudinary = require("cloudinary").v2;
  // Configure Cloudinary
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const fs = require("fs");        ///already installed with node || fs -> file


const methodOverride = require("method-override");
app.use(methodOverride('_method'));

const path = require('path');
let flag = true; //check erp_id
let flag2 = true;  //check password



let PORT = process.env.PORT || 8080;
app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended : true}));

async function main() {
    await mongoose.connect(process.env.MONGO_URI , {
        // useNewUrlParser : true,
        // useUnifiedTopology : true
    });
};

main()
.then(res=> console.log("connected to DB"))
.catch(err => console.log(err,"connection lost"));


const User = require("./models/newUser");   //user model
const allProject = require("./models/allProjects");  //projects model

app.get("/",(req,res)=>{
    res.send("Server Working");
})



app.get("/users",async function(req,res){            //allUsers
    let users = await User.find();
    flag=true;
    flag2 = true;
    // console.log(users);
    if(users) res.render("users.ejs" , {users});
    else res.send("users Not Available");
})



//register a new user

app.get("/users/newUser",function (req , res){
    res.render("newUser.ejs" , {flag});
    // console.log("hello");
});
app.post("/users" , async function(req,res){
    let {username , erp , password} = req.body;
    let user = await User.find({erp_id : erp });
    // console.log(username , erp , password);

    // console.log(user)
    if(user.length === 0){
        flag = true;
        let newUser = new User({
            username : username,
            erp_id : erp,
            password : password
        });
        newUser.save().catch(err =>console.log(err));
        res.redirect("/users");
    }
    else{
        // console.log(user)
        flag = false;
        res.redirect("/users/newUser");
    }
})



//login via button
app.get("/users/:erp_id/login",async function(req,res){
     let {erp_id} = req.params;
     try{
        let user = await User.findOne({erp_id : erp_id });
        if(!user){
            res.send("user Not Exist");
         }
         else{
            // console.log(user);
            res.render("enterPass.ejs" , {user , flag2});
         }
     }catch(err){
        console.log(err);
     }
})
app.post("/users/:erp_id" , async function(req,res){
    let {erp_id} = req.params;
    let {password} = req.body;
    let user = await User.findOne({erp_id : erp_id });
    if(user.password === password){
        flag2 = true;
        res.redirect(`/users/profile/${erp_id}`);
        // console.log("login Successful");
    }
    else{
        flag2 = false;
        res.redirect(`/users/${erp_id}/login`);
        // console.log("password incorect");
    }
});


app.get("/users/profile/:erp_id" , async function(req , res){          //show profile for both login methods
    let {erp_id} = req.params;
    let user = await User.findOne({erp_id : erp_id });
    let projects = await allProject.find({erp_id : erp_id}).sort({ _id: -1 });
    res.render("userProfile.ejs" , {user , projects});
})


//login via erp_id & pass
app.get("/users/login",function(req,res){
    res.render("enterPassErp.ejs" , {flag2});
    // console.log("mai hu error4");
})
app.post("/users/login/erp" , async function(req,res){
    let {erp_id , password} = req.body;
    let user = await User.findOne({erp_id : erp_id});
    // console.log("mai hu error4");
    if(!user){
        flag2 = false;
        res.redirect("/users/login");
    }
    else{
        if(user.password !== password){
            flag2 = false;
            res.redirect("/users/login");
        }
        else{
            flag2 = true;
            res.redirect(`/users/profile/${erp_id}`);
        }
    }
})




app.get("/users/profile/:erp_id/new",async function(req,res){
    let {erp_id} = req.params;
    let user = await User.findOne({erp_id : erp_id});
      res.render("newProject.ejs",{user});
})
app.post("/users/profile/:erp_id/new", upload.single("image"), async function (req, res) {
    let { erp_id } = req.params;
    let { title, description, link } = req.body;
  

    // Validate link
        if (!link || !validator.isURL(link)) {           //accept only valid url
            link = null; // Set to null if invalid
        }

    try {
      let imagePath = null; // Default to null if no image is provided
  
      if (req.file) {
        // If an image is uploaded, handle it
        const result = await cloudinary.uploader.upload(req.file.path);
  
        // Delete the file from the local system
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete local file:", err);
          else console.log("Local file deleted successfully");
        });
  
        imagePath = result.secure_url; // Save the Cloudinary URL
      }
  
      // Retrieve the user
      let user = await User.findOne({ erp_id: erp_id });
  
      // Create the new project
      let newProject = new allProject({
        username: user.username,
        erp_id: user.erp_id,
        title: title,
        description: description,
        link: link,
        imagePath: imagePath, // Null if no image is provided
        created_at: new Date(),
      });
  
      await newProject.save(); // Save the project to the database
      console.log("Project added successfully");
  
      // Redirect to the user's profile
      res.redirect(`/users/profile/${erp_id}`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Something went wrong");
    }
  });
  

//update user avatar
app.post("/users/:erp_id/avtar",upload.single("image"), async function(req,res){
    let { erp_id } = req.params;
    // console.log("sun lo bhai");
    // console.log(req.file);
    
    try {
        let avatar; 
    
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
    
          // Delete the file from the local system
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete local file:", err);
            else console.log("Local file deleted successfully");
          });
    
          avatar = result.secure_url; // Save the Cloudinary URL
        }
    
        if(avatar){
          await User.findOneAndUpdate({ erp_id: erp_id } , {avatar : avatar} , {runValidators : true});
        }
        

        
        res.redirect(`/users/profile/${erp_id}`);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Something went wrong || Avatar Uplod failed");
      }
})



//showing individual public profile to users
app.get("/users/:erp_id/public",async function(req,res){
  let {erp_id} = req.params;
  let user = await User.findOne({erp_id : erp_id });
  let projects = await allProject.find({erp_id : erp_id}).sort({ _id: -1 });
  res.render("publicProfile.ejs" , {user , projects});
})





//edit project
app.patch("/users/:id/edit" ,async function(req,res){
    let {id} = req.params;
    let project = await allProject.findOne({_id : id });
    res.render("editProject.ejs" , {project});
})
app.post("/users/:_id/edit",upload.single("image"),async function(req,res){
  let {_id} = req.params;
  let { title, description, link } = req.body;
  let project = await allProject.findOne({_id : _id });
  
  

  // Validate link
      if (!link || !validator.isURL(link)) {           //accept only valid url
          link = null; // Set to null if invalid
      }

  try {
    let imagePath = project.imagePath; // Default to null if no image is provided

    if (req.file) {
      // If an image is uploaded, handle it
      const result = await cloudinary.uploader.upload(req.file.path);

      // Delete the file from the local system
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
        else console.log("Local file deleted successfully");
      });

      imagePath = result.secure_url; // Save the Cloudinary URL
    }

  
    

    // Update the project
    await allProject.findByIdAndUpdate(_id,{
                        title : title,
                        description : description,
                        link : link,
                        imagePath : imagePath
    },{runValidators : true});
    console.log("Project updated successfully");

    // Redirect to the user's profile
    res.redirect(`/users/profile/${project.erp_id}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong");
  }
})




//deleting the project
app.delete("/users/:_id/delete" , async function(req,res){
  let {_id} = req.params;
  let project = await allProject.findOne({_id : _id });
  await allProject.findByIdAndDelete(_id);
  res.redirect(`/users/profile/${project.erp_id}`);
})

















//all projects
app.get("/projects",async function(req,res){
    flag=true;
    flag2 = true;
    let projects = await allProject.find().sort({ _id: -1 }).exec();
    let users = await User.find();
    res.render("allProjects.ejs",{projects , users});
})











app.listen(PORT , ()=>{
    console.log("app listen to port : ",PORT);
})
