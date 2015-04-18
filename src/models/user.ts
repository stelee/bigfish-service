var mongoose =require("mongoose");
module.exports = mongoose.model("User",{
  'email' : {type: String, index:{unique:true},required: true},
  'password' : {type:String,required:true},//unsafe to store the password as plain text
  'title' : String,
  'firstName' : String,
  'lastName' : String,
  'birthday' : Date
});
