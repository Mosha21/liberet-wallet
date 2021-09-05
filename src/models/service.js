const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    cost: {
        required: true,
        type: Number,
        validate(value) {
            if(value < 0) throw new Error('Invalid cost of service')
        }
    },
    creditsAnalytics: {
        default: 0,
        type: Number,
        validate(value) {
            if(value < 0) throw new Error('Invalid')
        }
    }
}, {
    timestamps: true
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service