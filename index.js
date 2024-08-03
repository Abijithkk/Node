// load.env file
require('dotenv').config()
// import express
const express=require('express')

const cors=require('cors')

const routes=require('./Routes/routes')
require('./db/connection')


// create server using express
const projectServer=express()
projectServer.use(cors())
// convert all incoming json data to js data
projectServer.use(express.json())

projectServer.use(routes)



const PORT=4000  || process.env.PORT
projectServer.listen(PORT,()=>{
    console.log(`______Project Server Started At Port Number ${PORT}______`);
})

// resolve api requests
projectServer.get('/',(req,res)=>{
    res.send(`<h1>Project started ...</h1>`)
})

