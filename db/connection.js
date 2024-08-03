const mongoose=require('mongoose')
const connectionString=process.env.DATABASE
mongoose.connect(connectionString).then(()=>{
    console.log("mongo db atlas connectd");
}).catch((err)=>{
    console.log(`mongo db atlas connection failed !! ${err}`);
})