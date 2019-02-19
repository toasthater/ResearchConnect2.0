const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req);
    res.send(req);
});

module.exports = router;