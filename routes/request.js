const express = require('express');
const requestController  = require('../controllers/requestController');
const router = express.Router();
const passport = require('passport');

console.log("fdjkfbg-----------------")

router.post('/',passport.authenticate('jwt', { session: false }),requestController.create);
router.put('/:id',passport.authenticate('jwt', { session: false }),requestController.update);
router.delete('/:id',passport.authenticate('jwt', { session: false }),requestController.delete);
router.get('/pending',passport.authenticate('jwt', { session: false }),requestController.pending);
router.get('/approved',passport.authenticate('jwt', { session: false }),requestController.approved);
router.get('/rejected',passport.authenticate('jwt', { session: false }),requestController.rejected);
router.get('/:departmentId/incoming',passport.authenticate('jwt', { session: false }),requestController.incoming);
router.get('/getUserInfo',passport.authenticate('jwt', { session: false }),requestController.getUserInfo);
router.get('/notifications',passport.authenticate('jwt', { session: false }),requestController.getNotifictions);


module.exports = router;