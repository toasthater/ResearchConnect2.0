const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cloudinary = require('../../cloudinary-setup');
const User = require('../../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // console.log('In function!');
    const formData = {};
    let DONE_FIELDS = false;
    let DONE_FILE = false;
    let EDITED_USER = null;
    let RES_SENT = false;
    let FILE_ATTACHED = false;
    req.busboy.on(
      'field',
      async (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype,
      ) => {
        formData[fieldname] = val;
        // console.log(`Field [${fieldname}]: value: ${val}`);
        if (formData.name !== undefined && formData.bio !== undefined) {
          await User.findByIdAndUpdate(
            req.user.id,
            {
              $set: {
                name: formData.name,
                bio: formData.bio,
                isSetup: true,
              },
            },
            (err, user) => {
              if (err) {
                // console.log('Something wrong when updating data!');
                res.send(null);
              } else {
                EDITED_USER = user;
                DONE_FIELDS = true;
                FILE_ATTACHED = !(formData.filename == '');
                // console.log(`File attached: ${FILE_ATTACHED}`);
                if (
                  (!FILE_ATTACHED || (DONE_FIELDS && DONE_FILE))
                  && !RES_SENT
                ) {
                  // console.log('Sending response');
                  res.send(EDITED_USER);
                  RES_SENT = true;
                }
              }
            },
          );
        }
      },
    );
    req.busboy.on(
      'file',
      async (fieldname, file, filename, name, encoding, mimetype) => {
        if (filename && filename !== undefined) {
          // console.log('Going in here anyway!!');
          // console.log(filename);
          const tmpPath = path.join(os.tmpdir(), `${req.user.id}_${filename}`);
          file.pipe(fs.createWriteStream(tmpPath));
          const upload = cloudinary.v2.uploader.upload(
            tmpPath,
            {
              public_id: req.user.id,
              unique_filename: false,
              overwrite: true,
            },
            (err) => {
              if (err) {
                // console.log(err);
              }
            },
          );

          upload
            .then((data) => {
              User.findByIdAndUpdate(
                req.user.id,
                { $set: { profile_pic: data.url } },
                (err, user) => {
                  if (err) {
                    // console.log('Something wrong when updating data!');
                    res.send(null);
                    RES_SENT = true;
                  } else {
                    EDITED_USER = user;
                    DONE_FILE = true;
                    if (DONE_FIELDS && DONE_FILE) {
                      res.send(EDITED_USER);
                      RES_SENT = true;
                    }
                  }
                },
              );
            })
            .catch((err) => {
              // console.log(err);
            });
        }
      },
    );

    req.pipe(req.busboy);

    // //console.log("Public id of the file is  " + file.public_id);
    // //console.log("Url of the file is  " + file.url);
  } catch (err) {
    (err) => {
      // console.log(err);
    };
  }
});

module.exports = router;
