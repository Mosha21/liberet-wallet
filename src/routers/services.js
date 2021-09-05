const express = require('express')
const Service = require('../models/service')
const passport = require('passport')
const {chargeCredit} = require('../utils/workers')

const router = express.Router()

router.post('/services', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(!req.user.isAdmin()) return res.status(404).send()

    const newService = new Service(req.body)

    try {
        await newService.save()

        res.status(201).send({ service: newService })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/services', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const services = await Service.find()
        
        res.status(200).send(services)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/services/campaign', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
     const supplier = req.user

    if(supplier.campaign) supplier.campaign = false
    else {
        if(supplier.credits === 0) return res.status(400).send({ error: 'Not enough credits' })

        supplier.wallet.events.push({
            event: 'Marketing campaign',
            date: new Date()
        })
        supplier.credits -= 1
        supplier.campaign = true
    }
    
    chargeCredit(supplier._id)
 
    await supplier.save()

    res.status(200).send(supplier)
    } catch (error) {
        res.status(400).send(error)
    }
 })

router.post('/services/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
   try {
    const service = await Service.findById(req.params.id)

    if(!service) return res.status(404).send()

    const supplier = req.user
    if(supplier.credits - service.cost < 0) return res.redirect('/suppliers/me/recharge')

    supplier.credits -= service.cost
    supplier.wallet.events.push({
        event: service.name,
        date: new Date()
    })

    service.creditsAnalytics += service.cost

    await supplier.save()
    await service.save()

    res.status(200).send(supplier)
   } catch (error) {
       res.status(400).send(error)
   }
})

module.exports = router