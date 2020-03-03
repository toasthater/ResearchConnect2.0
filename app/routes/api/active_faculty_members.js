const express = require('express');

const router = express.Router();


// Schemas

const ActiveFaculty = require('../../models/ActiveFaculty');

// Search through users and return relevant data
async function searchUsers(name) {
  const users = await ActiveFaculty.find();

  return users;
}

// @route GET api/search
// @desc  GET relevant search results
// @access Public



router.get('/test', (req, res) => {
    res.send('Greetings from the Test controller!');
});


router.get('/', (req, res) => {
    if (req.query.cruzid !== undefined) {
      ActiveFaculty.findOne({
        cruzid: {
          $regex: req.query.cruzid,
          $options: 'i',
        },
      })
        .then(user => res.send(user))
        .catch(err => res.status(404).json(
          { success: true },
        ));
    } else if (req.query.id !== undefined) {
      ActiveFaculty.findById(req.query.id)
        .then(user => res.send(user))
        .catch(err => res.status(404).json({ success: true }));
    }
});


router.get('/list', (req, res) => {
    ActiveFaculty.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});

router.get('/poop', (req, res) => {
    ActiveFaculty.find()
        .then(posts => res.json(posts));
    res.send('Greetings from the poop');
});

router.post('/add', (req, res) => {
    
    
    // Create a Note
    let note = new ActiveFaculty({
        cruzid: req.body.cruzid,
        name: req.body.name,
        email: req.body.email,
        page: req.body.page
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
});


module.exports = router;
