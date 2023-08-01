
const mongoose = require("mongoose")
//connecting to the mongodb
mongoose.connect("mongodb://127.0.0.1:27017/url-shortner-db").then(() => { //step:2
  console.log("Mongodb connected successfully");
}).catch(()=>{
  console.log("Mongodb not connected properly")
})

//creating the schema
const schema = new mongoose.Schema( //step:3
  {
    shortID: {
      type: String,
      required:true,
      unique: true,
    },
    redirectingURL:{
        type:String,
        required:true,
    },
    totalClicks: {
      type: Number,
      default:0,
    },
  },
  { timestamps: true }
);
//creating the model
const URL = mongoose.model("shortUrl_collection", schema); //step:4
module.exports = URL