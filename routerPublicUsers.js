const express = require('express');
const crypto = require('crypto');
const routerPublicUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
let fs=require("fs")
const database= require("./database")

routerPublicUsers.post("/verification",async(req,res)=>{
    let emailUser = req.body.email  
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    database.connect()

    try{
        const user= await database.query("SELECT * FROM user where email= ? and password= ?", [emailUser, passwordEncript])
        const userEmail= await database.query("SELECT * FROM user where email= ?", [emailUser])

        if(user.length>=1 ){

 
            let apiKey = jwt.sign(
                { 
                    email: emailUser,
                    userId: user[0].id
                },
                "secret");

            objectOfApiKey.push(apiKey)
            database.disConnect()
            return res.send(
            {
                message:"user",
                apiKey: apiKey,
                name:user[0].name,
                userId: user[0].id,
                email: user[0].email,

            })
        }else if(userEmail.length>0){
            database.disConnect()
            return res.send(
            {
                message:"Incorrect password"
            })
        }else if(userEmail.length==0){
            database.disConnect()
            return res.send(
            {
                message:"Incorrect email"
            })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

routerPublicUsers.post("/",async(req,res)=>{

    let email = req.body.email
    let password = req.body.password
    let name =  req.body.name

    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    database.connect()

    try{
        const emailUser=await database.query("SELECT email FROM user where email =? ", [email])

        if(emailUser.length>0){
            database.disConnect()
            return res.send({
                message:"Email already in use",
                error: "error in email"
            })
        }else{
                await database.query("INSERT INTO user (name, password, email) VALUES  (?, ?, ?) ", [name, passwordEncript, email])
                const user= await database.query("SELECT * FROM user where email=? and password=?", [email, passwordEncript])   
                if(user.length>=1){
        
                    let apiKey = jwt.sign(
                        { 
                            email: email,
                            userId: user[0].id
        
                        },
                        "secret");
        
                    objectOfApiKey.push(apiKey)
                    database.disConnect()
                    return res.send(
                    {
                        message:"user",
                        apiKey: apiKey,
                        name: user[0].name,
                        userId: user[0].id,
                        
                    })
                        
                }  
            
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }
})
module.exports=routerPublicUsers
