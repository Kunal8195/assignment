/** 3rd Party **/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
	// This is compulsory if it is not an FB signup or google signup
    fullName: {type: String, trim: true, required: true},
    phoneNo: {type: String, trim: true, index: true, default:false, min: 8, max: 15},    
    email: {type: String, trim: true, unique: true, index: true},
    password: {type: String, min:8},    
    dob : {type: String, default: null},
    doubleAuth: {type: Boolean, default: false},

    // This is what we get from FB SignUp
    facebookAccessToken: {type: String, default: null, trim: true, index: true},
    facebookApplicationId: {type: String, default: null, trim: true, index: true},
    facebookUserId: {type: String, default: null, trim: true, index: true},
    facebookLogin: {type: Boolean, default: false},

    // This is what we get form Google SignUp
    googleAccessToken: {type: String, default: null, trim: true, index: true},
    googleApplicationId: {type:String, default: null, trim: true, index: true},
    googleUserId: {type: String, default: null, trim: true, index: true},
    googleLogin: {type: Boolean, default: false}
});

module.exports = mongoose.model('user', user);
