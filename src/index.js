const PORT = 80;
const express = require('express');
const productsRouter = require("./routes/products");
const cookieParser = require('cookie-parser');
const expressSession = require("express-session")

const app = express();

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Function} next 
 */
const loggingMiddleware = ( req, res, next ) => {
  console.log(`[${new Date().toDateString()}] ${req.method} AT ${req.url}`)
  next()
}

app.use(express.json())
app.use(cookieParser())
app.use(expressSession({secret: "supersecretpass", cookie: { maxAge: 1000*60*60*24*15 }, saveUninitialized: false, resave: false}))
app.use(loggingMiddleware)
app.use("/api/products", productsRouter)
app.listen(PORT, () => {
  console.log(`Server is up at port ${PORT}`);
});

app.get("/", ( req, res ) => {
  res.cookie("hello", "world", { maxAge: 100000 })
  req.session.static = 1
  
  if(req.session.count){
    req.session.count++
  }else{
    req.session.count = 1
  }

  console.log(req.session)

  if(!req.session.auth){
    return res.send("Unauthorized")
  }

  res.send("Hi\n Visits: " + req.session.count)
})


//* This Part Was Literally made in 5 minutes. please dont bully :)
users = {}

app.get("/auth/:user/:pass", ( req, res ) => {
  if(users[req.params["user"]]){
    if(users[req.params["user"]] == req.params["pass"]){
      req.session.auth = true
      req.session.user = req.params["user"]

      return res.send("YEEEE")
    }else {
      return res.send("NOPE")
    }
  }else{
    users[req.params["user"]] = req.params["pass"]
    return res.send("SIGNUP DONE")
  }
})
