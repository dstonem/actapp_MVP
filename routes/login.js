const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const db = require('../db_connection')
const User = require('../models/users-db-logic')(db,router)
const authenticate = require('../authenticate')

router.use(bodyParser.urlencoded({extended:true}))

router.get('/', (req,res,next) => {
    let user = {username:req.session.username,password:req.session.password}
    res.render('login',{
        locals:{
            user,
            message:""
        }
    })
})

router.post('/', async (req,res,next) => {
    let username = req.body.username
    let password = req.body.password
    let user_id

    if(req.session) {
        req.session.username = username
        req.session.password = password
        req.session.user_id = user_id
    }

    let isValid = await User.login(req.session.username,req.session.password)
    console.log(`User ID: ${isValid.id}`)
    if(isValid){
        req.session.user_id = isValid.id
        res.redirect('/feed')
    } else {
        res.render('login',{locals:{message:"Username and/or password invalid. Try again."}})
    }
})

router.get('/register',(req,res,next) => {
    res.render('register',{locals: {message: ''}})
})

router.post('/register', async (req,res,next) => {
    let username = req.body.username
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let streetaddress = req.body.streetaddress
    let city = req.body.city
    let state = req.body.state
    let zipcode = req.body.state
    let cause1 = req.body.cause1
    let cause2 = req.body.cause2
    let cause3 = req.body.cause3
    let user_id

    if(req.session) {
        req.session.username = username
        req.session.password = password
        req.session.firstName = firstName
        req.session.lastName = lastName
        req.session.email = email
        req.session.streetaddress = streetaddress
        req.session.city = city
        req.session.state = state
        req.session.zipcode = zipcode
        req.session.profilepic = profilePic
        req.session.cause1 = cause1
        req.session.cause2 = cause2
        req.session.cause3 = cause3
        req.session.user_id = user_id
    }
    
    let isValid = await User.register(req.session.username, req.session.password, req.session.firstName, req.session.lastName, req.session.email, req.session.streetaddress, req.session.city, req.session.state, req.session.zipcode, req.session.cause1, req.session.cause2, req.session.cause3)

    if(isValid){
        req.session.user_id = isValid.id
        console.log(`User ID after registration: ${req.session.user_id}`)
        res.redirect('/login/survey')
    } else {
        res.render('register',{locals: {message: 'Username already exists'}})
    }
    
})

router.get('/survey',authenticate,(req, res, next) =>{
    res.render('survey',{locals:{message:""}})
})

router.post('/survey', async (req, res, next) => {
    let cause1 = req.body.cause1
    let cause2 = req.body.cause2
    let cause3 = req.body.cause3

    if(req.session){
        req.session.cause1 = cause1
        req.session.cause2 = cause2
        req.session.cause3 = cause3
    }

    // console.log(cause1)

    let isValid = await User.storeUsersCauses(req.session.cause1, req.session.cause2, req.session.cause3, req.session.username)
    
    // console.log(isValid)

    if(isValid){
        res.redirect('/feed')
    } else {
        res.render('survey',{locals:{message:"Please select at least one cause"}})
    }
    
    
})

router.get('/updateUser', (req, res, next) =>{
    res.render('updateUser',{
        locals:{
            user:req.session
        }
    })
})

router.post('/updateUser', (req, res, next) =>{
    let username = req.body.username
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let streetaddress = req.body.streetaddress
    let city = req.body.city
    let state = req.body.state
    let zipcode = req.session.zipcode

    db.none('INSERT INTO users(username,password,firstName,lastName,email,streetaddress,city,state,userId) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', 
    [username, password, firstName, lastName, email, streetaddress, city, state, zipcode])
    .then(() => {
        res.send("SUCCESS")
    })
})

router.get('/deleteUser', (req, res, next) =>{
    res.render('deleteUser')
})

module.exports = router