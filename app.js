const express = require('express')
const app = express()
const {secret} = require('./config')
const port = 4321
const path = require('path')
const authenticate = require('./authenticate')

const userRoutes = require('./routes/login')
const feedRoutes = require('./routes/feed')
const profileRoutes = require('./routes/profile')
const uploadRoutes = require('./routes/upload')
const bodyParser = require('body-parser')

const es6Renderer = require('express-es6-template-engine')

app.engine('html', es6Renderer)
app.set('views', 'templates')
app.set('view engine', 'html')

const session = require('express-session')

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}))

app.use(express.json())
app.use(express.static("public"))
app.use('/login',userRoutes)
app.use('/feed',authenticate,feedRoutes)
app.use('/profile',authenticate,profileRoutes)
app.use('/upload',authenticate,uploadRoutes)
app.use(bodyParser.urlencoded({extended:false}))



app.get('/',(req,res) => res.send('working'))
app.get('/me',(req,res) => res.send(
    {id:req.session.user_id}
))

app.listen(port, ()=>{
    console.log(`Listening on port http://localhost:${port}`)
})