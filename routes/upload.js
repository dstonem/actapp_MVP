const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const formidable = require('formidable');
const Post = require('../models/post-db-logic')()
const path = require('path')

router.use(bodyParser.urlencoded({ extended:true }))

router.get('/',(req,res) => {
    res.render('upload',{
        partials:{
            headerNav: 'partials/headerNav'
        }
    })
})

router.post("/", (req,res)=>{

    let form = {};

    //this will take all of the fields (including images) and put the value in the form object above
    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
        form[name] = field;
        //form.profile image is undefined here: console.log(`form.profile_image:${form.profile_image}`)
        console.log(`form[name]:${name},${form[name]}`)
      })
    .on('fileBegin', (name, file) => {
        //sets the path to save the image
        console.log(`is it even doing this fileBegin?: ${name}`)
        //NEXT STEP: try to get this file path working
        file.path = __dirname.replace('routes','') + 'public/images/' + new Date().getTime() + file.name
    })
    .on('file', (name, file) => {
        //console.log('Uploaded file', name, file);
        console.log("is it even doing this fileBegin?")
        //can use what the form.profile_image returns as an images src when using it elsewhere
        form.picurl = file.path.replace(__dirname.replace('routes','')+'public',"");
        console.log(`form.profile_image: ${form.picurl}`)
    })
    .on('end', async ()=>{

        console.log(`SESSION VALUES: picurl: ${form.picurl}, username: ${req.session.username}, body: ${form.body}, tags:${form.tags}`)
        //XXXXX needs attention - profilepic
        let isValid = await Post.createPost(form.picurl, form.body, form.tags, req.session.user_id, req.session.username)
        
        if(isValid){
            // let currentPost = await Post.selectPost(form.picurl)
            // let feed = []
            // feed.append(currentPost)
            res.send(isValid)
        } else {
            res.send({error: "needs more data"})
        }
        
    })

})

module.exports = router