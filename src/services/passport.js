const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Supplier = require('../models/supplier')

module.exports = (passport) => {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const supplier = await Supplier.findOne({ _id: jwtPayload._id })

            if(supplier) return done(null, supplier)
            else return done(null, false, { message: 'User not found' })
        } catch (error) {
            return done(error, null)
        }
    }))
}