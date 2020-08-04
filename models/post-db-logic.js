const express = require('express')
const db = require('../db_connection')

let Post = () => {

    const createPost = async (picurl,body,causes,user_id,username) => {
            console.log(`Posting pic src: ${picurl}`)
            console.log(`WHO'S POSTING THIS: ${user_id}`)
            let newPost = await db.one('INSERT INTO posts (picurl,body,causes,user_id,username) VALUES ($1,$2,$3,$4,$5) RETURNING *',[`${picurl}`,`${body}`,`${causes}`,`${user_id}`,`${username}`])
            console.log(newPost)
            return newPost
        }

    const selectAllPostsFromCause = async (usersCauses) => {
        let postsInCause = await db.any(`SELECT * FROM posts WHERE causes LIKE '${usersCauses}'`)
        return postsInCause
    }

    const selectAllFromUser = async (user_id) => {
        let usersPosts = await db.any(`SELECT * FROM posts WHERE user_id = '${user_id}'`)
        return usersPosts
    }

    const selectIndividualPost = async (post_id) => {
        return await db.one(`SELECT * FROM posts WHERE id = '${post_id}'`)
    }

    const selectUsersCauses = async (user_id) => {
        let usersCauses = await db.one(`SELECT cause_one, cause_two, cause_three FROM users WHERE id = '${user_id}'`)
        console.log(usersCauses)
        return usersCauses
    }

    const getPostLikes = async (post_id) => {
        return await db.any(`SELECT * FROM likes WHERE post_id = '${post_id}'`)
    }

    const likePost = async (user_id,post_id) => {
        //try to return the count of rows with post_id of __ then send it back to the feed.html through img-to-feed
        await db.none(`INSERT INTO likes (user_id,post_id) VALUES ($1,$2)`,[`${user_id}`,`${post_id}`])
        // return await db.any(`SELECT * FROM likes WHERE post_id = '${post_id}'`)
        return await getPostLikes(post_id)
    }

    const getPostComments = async (post_id) => {
        return await db.any(`SELECT * FROM comments WHERE post_id = '${post_id}'`)
    }

    const addCommentToPost = async (comment, post_id, user_id, username) => {
        await db.none(`INSERT INTO comments (comment,post_id,user_id,username) VALUES($1,$2,$3,$4)`,[`${comment}`,`${post_id}`,`${user_id}`,`${username}`])
        return getPostComments(post_id)
    }
    
    // const searchPost = async () => {
    //     let post = await db.none(`SELECT id FROM posts WHERE picurl = '${picurl}'`)
    //     console.log(`The post info is: ${post}`)
    //     if(post.length > 0){
    //         console.log(post)
    //         return false
    //     } else {
    //         if(picurl != null){
    //             return false
    //         }
    //     return true
    // }
// }


    return {
        createPost,
        selectIndividualPost,
        selectAllFromUser,
        selectAllPostsFromCause,
        selectUsersCauses,
        getPostLikes,
        likePost,
        getPostComments,
        addCommentToPost
        // searchPost
    }
    
}

module.exports = Post
