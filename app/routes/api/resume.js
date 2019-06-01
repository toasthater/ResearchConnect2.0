const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cloudinary = require('../../cloudinary-setup');
const User = require('../../models/User');
const Student = require('../../models/Student');

const router = express.Router();

// @route POST api/resume
// @desc  POST new resume to user
// @access Public
router.post('/', (req, res) => {
  if (!req.user || !req.busboy) {
    res.send(null);
    return;
  }

  // Busboy is used to parse HTML form data
  req.busboy.on('file', (fieldname, file, filename, name, encoding, mimetype) => {
    // These two lines are used to create a temporary path on the local machine for Cloudinary purposes
    const tmpPath = path.join(os.tmpdir(), `${req.user.id}.pdf`);
    file.on('end', () => {
      // Cloudinary is another database where we store resumes and pictures
      const upload = cloudinary.v2.uploader.upload(tmpPath, {
        public_id: req.user.id + "_resume",
        unique_filename: false,
        overwrite: true,
      }, (err) => {
        if (err) {
          console.log(err);
        }
      });

      // After the upload is done store the URL onto the User
      upload.then((data) => {
        User.findByIdAndUpdate(req.user.id, { $set: { resume: data.url } }, (err, result) => {
          if (err) {
            console.log(err);
            res.send('Error uploading resume');
          } else {
            const relevantStudent = Student.findOne({
              cruzid: {
                $regex: result.cruzid,
                $options: 'i',
              },
            });

            relevantStudent.then((student) => {
              student.resume = data.url;
              student.save().then(() => res.send('Done uploading resume'));
            });
          }
        });
      }).catch((err) => {
        console.log(err);
        res.send('Error uploading resume');
      });
    });

    file.pipe(fs.createWriteStream(tmpPath));
  });

  req.pipe(req.busboy);
});

module.exports = router;
