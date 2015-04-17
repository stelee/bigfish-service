var mongoose =require("mongoose");
module.exports = mongoose.model("Menu",{
  'name' : String,
  'description' : String
});
