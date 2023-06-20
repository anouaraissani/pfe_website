const express = require('express')
const router = express.Router()
//hash and compare passwords
const bcrypt = require('bcrypt')
const {checkAuthenticated, checkNotAuthenticated} = require('../middlewares/authentification')
const {userspage, getUserCount, fetchDataUsers, getRegister, postRegister, editUser, updateUser, deleteUser} = require('../controllers/usersManagement')


//use static files(.css, .html, ...)
router.use(express.static('./views'))

// router.get('/', checkAuthenticated, (req, res) => {
router.get('/', userspage)

// router.get('/users', checkAuthenticated, fetchDataUsers)
router.get('/api/users', fetchDataUsers)
// router.get('/users', checkAuthenticated, getUserCount)
router.get('/api/usercount', getUserCount)

// router.route('/register').get(checkNotAuthenticated, getRegister).post(checkNotAuthenticated, postRegister)
router.route('/register').get(getRegister).post(postRegister)

// edit user, update user
router.route('/edit/:id').get(editUser).post(updateUser)


//delete a user
// router.get('/delete/:id', checkAuthenticated, async (req, res) => {
router.get('/delete/:id', deleteUser)

module.exports = router