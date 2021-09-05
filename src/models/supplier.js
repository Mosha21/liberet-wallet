const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('Invalid email')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    credits: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) throw new Error('Invalid amount')
        }
    },
    wallet: {
        events: [{
            date: Date,
            event: String
        }]
    },
    admin: {
        type: Boolean,
        default: false
    },
    products: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) throw new Error('Invalid amount')
        }
    },
    campaign: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

//supplierSchema.virtual()

supplierSchema.methods.toJSON = function () {
    const supplier = this
    const supplierObject = supplier.toObject()

     delete supplierObject.password

    return supplierObject
}

// Generate auth token
supplierSchema.methods.generateAuthToken = async function () {
    const supplier = this
    const token = jwt.sign({ _id: supplier._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15min' })

    await supplier.save()

    return token
}

// Checks if supplier or admin
supplierSchema.methods.isAdmin = function () {
    return this.admin
}

// Hashes password before saving supplier
supplierSchema.pre('save', async function (next) {
    const supplier = this

    if(supplier.isModified('password')) {
        supplier.password = await bcrypt.hash(supplier.password, 8)
    }

    next()
})

// Find supplier by email and password
supplierSchema.statics.findByCredentials = async function (email, password) {
    const supplier = await Supplier.findOne({ email })
    if(!supplier) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, supplier.password)
    if(!isMatch) throw new Error('Unable to login')

    return supplier
}

const Supplier = mongoose.model('Supplier', supplierSchema)

module.exports = Supplier