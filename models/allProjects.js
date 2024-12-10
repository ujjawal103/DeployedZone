const mongoose = require("mongoose");

const allProjectSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    erp_id :{
       type : Number,
       required : true,
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    link : {
        type : String,
        default : null
    },
    imagePath : {
        type : String
    },
    created_at :{
        type : Date,
        required : true
    }
});

const Project = mongoose.model("Project" , allProjectSchema);
module.exports = Project;
