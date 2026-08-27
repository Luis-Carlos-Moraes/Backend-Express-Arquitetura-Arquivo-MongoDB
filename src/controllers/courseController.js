const Course = require('../models/Course');

/** GET /courses -> 200 com a lista de cursos. */
async function list(req, res) {
  const courses = await Course.find().lean();
  return res.status(200).json(courses);
}

module.exports = { list };
