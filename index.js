const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoute = require('./routes/home')
const addRoute = require('./routes/add')
const coursesRoute = require('./routes/courses')
const cartRoute = require('./routes/cart')
const authRoute = require('./routes/auth')
const User = require('./models/user')

const app = express()
const uri = 'mongodb+srv://Simon:WmcX10dJvAf7NqFC@cluster0.y4xp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const store = new MongoStore({
    collection: 'sessions',
    uri
})

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs'
}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: '213h2ui237ia',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/courses', coursesRoute)
app.use('/cart', cartRoute)
app.use('/auth', authRoute)

const PORT = process.env.PORT || 3000

async function start(uri) {
    try {
        await mongoose.connect(uri)
        app.listen(PORT, () => {
            console.log(`Hello express: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}


start(uri)