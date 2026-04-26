const express = require('express')
const cors = require('cors')

const userRoutes = require('./routes/users')
const serviceRoutes = require('./routes/services')
const timeSlotRoutes = require('./routes/timeSlots')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/timeslots', timeSlotRoutes)

app.get("/", (req,res)=>{
    res.send("api runs")
})

module.exports = app
