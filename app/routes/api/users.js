const express = require('express');
const router = express.Router();

const Student = require('../../models/User');

router.get('/', async (req, res) => {
    let relevantStudents = Student.find({
            'cruzid': {
                '$regex': req.query.cruzid,
                $options: 'i'
            }
        });
    await relevantStudents.then(async (student) => {
        res.send(student);
    });
});

router.post('/setup', async (req, res) => {
    console.log('--------it gets the right function----------');
    User.findOneAndUpdate({_id:req.params.id}, req.body, function (err, place) {
        res.send(req.user);
      });
});


module.exports = router;