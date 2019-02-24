const express = require('express');
var cloudinary = require('cloudinary').v2;
const router = express.Router();
const User = require('../../models/User');
// const axios =  require('axios');
const multer = require('multer');
let upload = multer();

cloudinary.config(require("../../config/keys").cloudinary);

// var upload = multer({ dest : '../../data/profile_pictures'}).single('userPhoto');



router.post('/', upload.fields([]), async (req, res) => {
    try {
        console.log(`Body: \n ${JSON.stringify(req.body, null, 2)}`);
        if (req.body.file !== undefined){                                        
            const file = await cloudinary.uploader.upload(
                req.body.file,
                { 
                    tags: "gotemps",
                    resource_type: "auto" 
                }, 
                (error, result) => {
                    console.log(error, result);
                })
            console.log("Url of the file is  " + file.url);
        }
                                                                         
        // console.log("Public id of the file is  " + file.public_id);                                 
        // console.log("Url of the file is  " + file.url);
        const user = await User.findOneAndUpdate({_id:req.user._id}, {$set: {name: req.body.name, bio: req.body.bio, isSetup: true}}, 
            (err, user) =>   {
            if (err) {
                console.log("Something wrong when updating data!");
                res.send(null);
            }
        });
        res.send(user);
        

    }
    catch {(err) => {
        console.log(err);
    }}
    
});

module.exports = router;