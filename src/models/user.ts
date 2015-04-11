var mongoose =require("mongoose");
module.exports = mongoose.model("User",{
  'username' : String,
  'password' : String,
  'title' : String,
  'firstName' : String,
  'lastName' : String,
  'birthday' : Date
});
