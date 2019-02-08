const express = require('express');
const router = express.Router();

// Schemas
const Research = require('../../models/Research');
const Department = require('../../models/Department');
const FacultyMember = require('../../models/FacultyMember');

async function searchDepartments(name) {
    let relevantDepartments = Department.find({
        'name': {
            '$regex': name.toLowerCase(),
            $options: 'i'
        }
    });

    var ret;

    await relevantDepartments.then(async (data) => {
        let deptIDs = []
        for (let i = 0; i < data.length; i++) {
            deptIDs.push(data[i]._id);
        }

        let relevantPosts = Research.find({
            'department': deptIDs
        });

        await relevantPosts.then((posts) => {
            ret = posts;
        });
    });

    return ret;
};

async function searchFaculty(name) {
    let relevantFaculty = FacultyMember.find({
        'name': {
            '$regex': name.toLowerCase(),
            $options: 'i'
        }
    });

    var ret;

    await relevantFaculty.then(async (data) => {
        let facIDs = []
        for (let i = 0; i < data.length; i++) {
            facIDs.push(data[i]._id);
        }

        let relevantPosts = Research.find({
            'owner': facIDs
        });

        await relevantPosts.then((posts) => {
            ret = posts;
        });
    });

    return ret;
}

async function searchTitle(name) {
    let relevantPosts = Research.find({
        'title':{
            '$regex': name.toLowerCase(),
            $options: 'i'
        }
    });

    var ret;

    await relevantPosts.then((data) => {
        ret = data;
    });

    return ret;
}

router.get('/', (req, res) => {
    console.log("in the search function");
    switch (req.query.type)
    {
        case "Department":
            searchDepartments(req.query.query)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err);
            });

            break;
        case "Professor":
            searchFaculty(req.query.query)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err);
            });

            break;
        case "Title":
            searchTitle(req.query.query)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err);
            });
            
            break;
        default:
            var promises = [
                searchDepartments(req.query.query),
                searchFaculty(req.query.query),
                searchTitle(req.query.query)
            ];

            Promise.all(promises).then((data) => {
                let posts = [];

                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (posts.find(post => post._id === data[i][j]._id) !== undefined) {
                            continue;
                        }

                        posts.push(data[i][j]);
                    }
                }

                res.send(posts);
            })
            .catch((err) => {
                console.log(err);
            });

            break;
    }
});

module.exports = router;