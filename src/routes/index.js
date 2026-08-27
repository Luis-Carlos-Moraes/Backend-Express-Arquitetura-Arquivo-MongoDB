const { Router } = require('express');
const healthRoutes = require('./healthRoutes');
const courseRoutes = require('./courseRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/courses', courseRoutes);

module.exports = router;
