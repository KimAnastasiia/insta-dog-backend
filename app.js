const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
app.use(express.json())
var cors = require('cors')
app.use(cors())
const database= require("./database")

const objectOfApiKey = require("./objectApiKey")
const routerUsers =  require("./routerUsers")

// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
const jwt = require("jsonwebtoken");
const routerPublicUsers = require('./routerPublicUsers');


app.use(["/user"] ,async(req,res,next)=>{
    let apiKey = req.query.apiKey

    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )
    if(!obj){
        res.send({error:"error"})
        return
    }

    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;

    next()
})


app.use("/public/user", routerPublicUsers)
app.use("/user", routerUsers)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})