const express = require('express');
const cloudinary = require('cloudinary');
const fs = require('fs');
const os = require('os');
const path = require('path');

cloudinary.config(require('../../config/keys').cloudinary);

const router = express.Router();

router.post('/', (req, res) => {
    req.busboy.on('file', (fieldname, file, filename, name, encoding, mimetype) => {
      let tmpPath = path.join(os.tmpdir(), req.user.id + ".pdf");
      file.pipe(fs.createWriteStream(tmpPath));
      cloudinary.v2.uploader.upload(tmpPath, {}, err => { res.send("Done") });
    });

    req.pipe(req.busboy);
});

module.exports = router;