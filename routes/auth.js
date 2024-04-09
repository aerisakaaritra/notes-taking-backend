const express = require('express')
const models = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const fetchUser = require('../middlewares/fetchUser')

const JWT_key = 'astakfirullah'

// Route - 1

router.post('/signup', [
    body('name', 'name consists of minimun 3 characters').isLength({ min: 3 }),
    body('email', 'enter valid email').isEmail(),
    body('password', 'password must be minimun of 6 characters').isLength({ min: 6 })
], async(req, res) => {
    // Alternatuve way
        // const user = models(req.body)
        // user.save()
    // if error exists returning wiht bad request an the errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await models.findOne({ username: req.body.username })
        if(user){
            return res.status(400).json({ error: 'This username already exists!'})
        }
        user = await models.findOne({ email: req.body.email })
        if(user){
            return res.status(400).json({ error: 'This email already exists!'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        // create new user
        user = await models.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        }).then(user => res.json(user))

        const data = {
            user:{
                id: user.id
            }
        }
        const jwtToken = jwt.sign(data, JWT_key)
        console.log(jwtToken)

        // res.json(jwtToken)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

// Route - 2

router.post('/login', [
    body('password', 'password cannot be blank-please enter your password').exists()
], async(req, res) => {
    // if error exists returning wiht bad request an the errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const { username, password } = req.body
    try {
        let user = await models.findOne({username})
        if(!user){
            return res.status(400).json({ error: 'try to login with correct credentials' })
        }

        const passCompare = await bcrypt.compare(password, user.password)
        if(!passCompare){
            return res.status(400).json({ error: 'try to login with correct password' })
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const jwtToken = jwt.sign(data, JWT_key)
        console.log(jwtToken)
        res.json({token: jwtToken})

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }

})

// Route - 3

router.post('/user', fetchUser, async(req, res) => {
    try {
        let userId = req.user.id
        const user = await models.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

module.exports = router