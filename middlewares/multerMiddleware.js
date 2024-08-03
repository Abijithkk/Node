const multer=require('multer')

// storage -location and file name
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')

    },
    filename:(req,file,callback)=>{    //img123    image-datetime-img123
        callback(null,`image-${Date.now()}-${file.originalname}`)
    }
})

// file filter

const fileFilter=(req,file,callback)=>{
    if(file.mimetype=='image/jpg' || file.mimetype=='image/jpeg' || file.mimetype=='image/png'){
        callback(null,true)
    }
    else{
        callback(null,false)
    }
}

// multer middleware
const upload=multer({storage,fileFilter,})

module.exports=upload