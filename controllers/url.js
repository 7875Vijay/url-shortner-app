const express = require('express')
const shortUrl = require("shortid");
const model = require("../models/url")


//creating and connectiong to mongodb
const URL = model
async function generatingAndAssigningIDtoDB(req, res){
    //get the request body here so here i am getting the url from the json data
    const body = req.body;
    const originalURL = body.url; //extracting the url
    if(!originalURL){
        return res.status(400).json({msg:"URL Required"})
    }
    const newShortID = shortUrl(); //here we created the shortID of original url

    const newShortenerEntry = await URL.create({  //step:5
      shortID: newShortID,
      redirectingURL:originalURL,
    });
    // res.status(201).json({ id: newShortenerEntry.shortID });


    const htmlPage = `

    <!DOCTYPE html>
    <html lang="en">
        <head>
    
            <style>
                body{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    text-align: center;
                }
                .container{
                    background-color: #171717;
                    color: rgb(195, 204, 224);
                    padding: 10%;
                    min-width: fit-content;
                }
                #geturl{
                    background-color: rgb(195, 204, 224);
                    margin-bottom: 5px;
                    min-width: 200px;
                    max-width: fit-content;
                    font-size: larger;
                    border: 2px solid rgb(255, 9, 120) ;
                }
                #submiturl{
                    background-color: rgb(195, 204, 224);
                    min-width: 200px;
                    max-width: fit-content;
                    font-size: larger;
                    border: 2px solid rgb(255, 9, 120);
                    transition: all 0.5s; 
                }
                
                #urlbtn{
                    max-width: fit-content;
                    font-size: larger;
                    border: 2px solid rgb(255, 9, 120);
                    transition: all 0.5s;
                    text-decoration: none;
                }
                #urlbtn:hover{
                    color:rgb(195, 204, 224);
                    background-color: rgb(17, 13, 30);
                    border-radius: 5px;
                }
                #submiturl:hover{
                    color:rgb(195, 204, 224);
                    background-color: rgb(17, 13, 30);
                    border-radius: 5px;
                }
            </style>
    
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="style.css" rel="stylesheet">
        </head>
        
        <body>
          <div class="container">
            <h1>URL Shortner</h1>
            <form method="POST", action="/url">
                <label>Enter your original URL below</label><br>
                <input type="text" name="url" id="geturl" placeholder="https://example.com" required><br>
                <button type="submit" name="submiturl" id="submiturl">Generate</button>
            </form>
            <div>
              
                <h3>You url id will generate belowed soon</h3><br>
                <h2>${newShortenerEntry.shortID}</h2><br>
                <h3>Want to submit this code to Redirect</h3>
              <form method="GET", action="/url/${newShortenerEntry.shortID}">
                <button type="submit" name="urlbtn" id="urlbtn">Redirect On Original</button>
              </form>

              <form method="GET", action="/url/analysis/${newShortenerEntry.shortID}">
                <button type="submit" name="analysis">Analysis</button>
              </form>
            </div>
         </div>
        </body>
    </html>

    
    `
    return res.send(htmlPage)
}


async function redirectToMainURL(req, res){
    const shortID = req.params.id
    const entry = await URL.findOne({ shortID }); //step:6 
    // Increment the totalClicks count
    entry.totalClicks += 1;
    await entry.save();//saved and update in the database
    res.redirect(entry.redirectingURL)//redirecting the original url
}


async function analysisOfClicks(req, res){
    const shortID = req.params.id 
    if(!shortID){
      return res.status(400).json({error:"Provid proper short ID"})
    }
    const entry = await URL.findOne({shortID})
    return res.status(200).json({
      clickedURL:entry.redirectingURL,
      totalClicks:entry.totalClicks
    })
}

module.exports={
    generatingAndAssigningIDtoDB,
    redirectToMainURL,
    analysisOfClicks,
}