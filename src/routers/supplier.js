const express = require('express')
const Supplier = require('../models/supplier')
const auth = require('../middleware/auth')
const passport = require('passport')
const { update } = require('../models/supplier')

const router = new express.Router()

router.post('/suppliers', async (req, res) => {
    const newSupplier = new Supplier(req.body)

    try {
        await newSupplier.save()
        const token = await newSupplier.generateAuthToken()

        res.status(201).send({ supplier: newSupplier, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/suppliers/login', async (req, res) => {
    try {
        const supplier = await Supplier.findByCredentials(req.body.email, req.body.password)
        const token = await supplier.generateAuthToken()

        res.status(200).send({ supplier, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/suppliers/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.status(200).json({ supplier: req.user })
})

router.patch('/suppliers/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdate) return res.status(400).send({ error: 'Invalid update' })

    try {
        updates.forEach(update => req.supplier[update] = req.body[update])

        await req.supplier.save()
        res.status(200).send(req.supplier)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/suppliers/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await req.supplier.remove()

        res.send(req.supplier)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/suppliers/me/wallet/recharge', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(!req.body.amount) return res.status(400).send({ error: 'Amount not provided' })
    if(req.body.amount < 0) return res.status(400).send({ error: 'Invalid amount' })
    const supplier = req.user
    
    try {
        supplier.wallet += req.body.amount
        await supplier.save()
        res.status(200).send(supplier)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router