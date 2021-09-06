const express = require('express')

const router = new express.Router()
const name = 'Bernardo Moya'

router.get('', (req, res) => {
    res.render('index', {
        title: 'Liberet Wallet',
        name: name
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        name: name
    })
})
router.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Admin site',
        name: name
    })
})

router.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: name,
        errorMessage: 'Page not found.'
    })
})

module.exports = router