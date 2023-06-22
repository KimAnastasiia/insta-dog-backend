const express = require('express');
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database= require("./database")

routerUsers.get("/",async(req,res)=>{
    
    database.connect();
    try{
        const user= await database.query("SELECT name, id, email, date, breed from user WHERE id=?", [req.infoInToken.userId])
        database.disConnect()
        return res.send(user)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})




routerUsers.put("/photo",(req,res)=>{
    let img = req.files.myImage
    if (img != null) {
        img.mv('public/images/' + req.infoInToken.userId.toString()+'1.png', 
            function(err) {
                if (err) {
                    res.send("Error in upload picture");
                } else{
                    sharp('public/images/' + req.infoInToken.userId.toString()  +'1.png')
                    .resize(309,309)
                    .toFile('public/images/' + req.infoInToken.userId.toString() +'avatar.png', (errMini, infoMini) => {
                        if (errMini) {
                            console.error(errMini);
                            res.send("Error in resize picture");
                        } else {
                            res.send({message:"done"});
                        }
                    })
                    
                }
            }
        )
    }
})

routerUsers.put("/password",async(req,res)=>{
  
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        await database.query("UPDATE user SET password=? where id=?", [passwordEncript, req.infoInToken.userId])
        database.disConnect()
        return res.send({message:"done"});
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerUsers.post("/checkPassword",async(req,res)=>{

    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        const user = await database.query("SELECT * FROM user where id=? and password=?", [req.infoInToken.userId, passwordEncript])
        if(user.length>=1 ){
            database.disConnect()
            return res.send({ message:"right"})
        }else{
            database.disConnect()
            return res.send({ error:"Error" })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

module.exports=routerUsers