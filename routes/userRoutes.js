const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const passport = require('passport');

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .delete(usersController.deleteUser);


router.post('/login', passport.authenticate('local'), usersController.loginUser);
router.post('/logout', usersController.logoutUser);
router.get('/:userId', usersController.getOneUserById);
router.put('/:userId', usersController.getOneUserAndUpdate);
router.delete('/:userId', usersController.deleteUser);

module.exports = router;