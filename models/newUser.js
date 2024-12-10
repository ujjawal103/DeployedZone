const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    erp_id : {
        type : Number,
        required : true,
        unique : true,
    },
    avatar : {
        type : String,
        default : "/images/unknown user icon avatar white professional 3d.jpeg"
    },
    password : {
        type : String,
        required : true,
    }
});

const User = mongoose.model("User" , userSchema);
module.exports = User;