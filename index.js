const express = require("express");
const jwt = require('jsonwebtoken');

const JWT_SECRET = "deepanshu1234"

const app = express();
app.use(express.json());

const users = []

app.post("/signup", function(req, res){
    const username = req.body.username
    const password = req.body.password
    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })
})

app.post("/signin", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    let foundUser = null
    for(let i = 0; i < users.length; i++){
        if(users[i].username == username && users[i].password == password){
            foundUser = users[i]
        }
    }

    if(foundUser){
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

        res.json({
            token: token
        })
    }
    else{
        res.status(403).send({
            message: "Invalid credentials"
        })
    }

})

function auth(req, res, next){
    const token = req.headers.token;
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    if(decodedInformation.username){
        req.username = decodedInformation.username
        next();
    }
    else{
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", auth, function(req, res){
        let foundUser = null;

        for(let i = 0; i < users.length; i++){
            if(users[i].username === req.username){
                foundUser = users[i]
            }
        }

        res.json({
            username:foundUser.username,
            password: foundUser.password
        })
})

app.listen(3000);