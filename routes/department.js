const express = require('express');
const departmentController  = require('../controllers/departmentController');
const router = express.Router();
const passport = require('passport');


router.post('/create',departmentController.create);
router.get('/getDepartments',departmentController.getDepartments);
router.get('/getDepartmentsForReq',passport.authenticate('jwt', { session: false }),departmentController.getDepartmentsForReq);
module.exports = router;