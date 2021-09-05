const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const generalRoutes = require('./routers/routes')
const passport = require('passport')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(userRouter, generalRoutes)

require('./services/passport')(passport)
app.use(passport.initialize())

module.exports = app