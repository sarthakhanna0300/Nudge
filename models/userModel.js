const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
name:{
  type:String,
  required:true
},
email: {
  type: String,
  required: true,
  lowercase: true,
  unique: true,
},
password: { type: String, required: true },
avatarURL: String
})


User = mongoose.model(User,UserSchema);

module.exports =User;