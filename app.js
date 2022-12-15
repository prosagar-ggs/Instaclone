const express = require('express')
const app = express()
const port = process.env.PORT || 5003
const mongoose = require('mongoose')
const { MONGOURL } = require('./config/keys')
require('./models/user')
require('./models/post')

//sagar3255
//fFXipbD9nnyZDkFY

mongoose.connect(MONGOURL)
// for true case
mongoose.connection.on('connected', 
    () => { console.log('connected to mongoDB')}
)
// for false case
mongoose.connection.on('error',
    (err) => { console.log("error connecting to mongoDB",err)}
)

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if (process.env.NODE_ENV == "production") {
    const path = require('path')
    app.get("*", (req, res) => {
        app.use(express.static(path.resolve(__dirname, "client", "build")))
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


app.listen(port,()=>{console.log(`server listening on port ${port}`)})