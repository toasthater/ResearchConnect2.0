const express = require('express');
const cloudinary = require('../../cloudinary-setup');
const fs = require('fs');
const os = require('os');
const path = require('path');
const User = require('../../models/User');
const Student = require('../../models/Student');

const router = express.Router();

router.post('/', (req, res) => {
    req.busboy.on('file', (fieldname, file, filename, name, encoding, mimetype) => {
      let tmpPath = path.join(os.tmpdir(), req.user.id + ".pdf");
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
        User.findByIdAndUpdate(req.user.id, { $set: { resume: data.url }}, (err, result) => {
          if (err) {
            console.log(err);
            res.send("Error uploading resume");
          } else {
            let relevantStudent = Student.findOne({
              'cruzid': {
                  '$regex': result.cruzid,
                  $options: 'i'
              }
            });

            relevantStudent.then(student => {
              student.resume = data.url;
              student.save().then(() => res.send("Done uploading resume"));
            });
          }
        });
      }).catch(err => {
        console.log(err);
        res.send("Error uploading resume");
      });
    });

    req.pipe(req.busboy);
});

module.exports = router;