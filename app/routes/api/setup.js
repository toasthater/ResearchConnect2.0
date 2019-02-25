const express = require('express');
const User = require('../../models/User');
const cloudinary = require('../../cloudinary-setup');
const fs = require('fs');
const os = require('os');
const path = require('path');
const router = express.Router();



router.post('/', async (req, res) => {
    try {        
        console.log("In function!");  
        var formData = {};
        done_fields = false;
        done_file = false;
        edited_user = null;
        req.busboy.on('field', async (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
          formData[fieldname] = val;
          console.log('Field [' + fieldname + ']: value: ' + val);
          if (formData['name'] !== undefined && formData['bio'] !== undefined){
            await User.findByIdAndUpdate(req.user.id, {$set: {name: formData['name'], bio: formData['bio'], isSetup: true}}, 
              (err, user) =>   {
              if (err) {
                  console.log("Something wrong when updating data!");
                  res.send(null);
              }
              else {
                edited_user = user;
                done_fields = true;
                if (done_fields && done_file)
                  res.send(edited_user);
              }
          });
          }
        });   
        req.busboy.on('file', async (fieldname, file, filename, name, encoding, mimetype) => {
            let tmpPath = path.join(os.tmpdir(), req.user.id + "_" + filename);
            file.pipe(fs.createWriteStream(tmpPath));
            const upload = cloudinary.v2.uploader.upload(tmpPath, {
              public_id: req.user.id,
              unique_filename: false,
              overwrite: true
            }, err => { 
              if (err) {
                console.log(err);
              }
            });
      
            upload.then(data => {
              User.findByIdAndUpdate(req.user.id, { $set: { profile_pic: data.url }}, 
                (err, user) =>   {
                  if (err) {
                      console.log("Something wrong when updating data!");
                      res.send(null);
                  }
                  else {
                    edited_user = user;
                    done_file = true;
                    if (done_fields && done_file)
                      res.send(edited_user);
                  }
                });
            }).catch(err => {
              console.log(err);
            });
          });
      
          req.pipe(req.busboy);
        
                                                                         
        // console.log("Public id of the file is  " + file.public_id);                                 
        // console.log("Url of the file is  " + file.url);

    }
    catch {(err) => {
        console.log(err);
    }}
    
});

module.exports = router;