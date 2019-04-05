const FacultyMember = require('../../models/FacultyMember');
const Department = require('../../models/Department');
const Application = require('../../models/Application');
const User = require('../../models/User');

module.exports = async function fillResearchPost(research) {
  const owner = await FacultyMember.findById(research.owner);
  const department = await Department.findById(research.department);
  research.owner = owner;
  research.department = department;

  if (research.applicants === null || research.applicants.length === 0) {
    return research;
  }

  for (let i = 0; i < research.applicants.length; i++) {
    const applicant = await Application.findById(research.applicants[i]);
    const student = await User.findById(applicant.student);
    research.applicants[i] = applicant.toJSON();
    research.applicants[i].student = student;

    if (i === research.applicants.length - 1) {
      return research;
    }
  }
};
