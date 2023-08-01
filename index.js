const express = require("express");
const path = require("path")
const {generatingAndAssigningIDtoDB, redirectToMainURL, analysisOfClicks} = require("./controllers/url")
const URL = require("./models/url")
const ejs = require("ejs")
const PORT = 8001

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json()) //for the incomming requiests


//server side rendering practice:
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.get("/", async(req, res)=>{
    return res.render("home")
})

//TASK:1
app.post("/url", generatingAndAssigningIDtoDB);

//TASK:2
app.get("/url/:id", redirectToMainURL)

//TASK:3
app.get("/url/analysis/:id", analysisOfClicks)

app.listen(PORT, () => console.log(`The server started successfully at port: ${PORT}`))