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
        helpText: 'This is some helpful text.',
        title: 'Login',
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