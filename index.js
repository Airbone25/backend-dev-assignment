require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use('/',apiRouter)
app.use('/auth',authRouter)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running')
})