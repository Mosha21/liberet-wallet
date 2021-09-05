const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const passport = require('passport')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()

        res.status(201).send({ user: newUser, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.status(200).json({ user: req.user })
})

module.exports = router