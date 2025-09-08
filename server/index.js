const express = require('express')
const cors = require('cors')
//load the env variables
require("dotenv").config()
// database connection
require('./config/database')

const app = express()
const PORT = process.env.PORT || 3001

// import routes
const userRoutes = require('./routes/users')

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users', userRoutes)


app.get("/", (req,res)=>{
    res.send("api runs")
})

app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
)