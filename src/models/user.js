const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    }
}, {
    timestamps: true
})

//userSchema.virtual()

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

     delete userObject.password

    return userObject
}

// Generate auth token
user.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1min' })

    await user.save()

    return token
}

// Hashes password before saving user
user.pre('save', function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = bcrypt.hash(user.password, 8)
    }

    next()
})

// Find user by email and password
user.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    if(!user) throw new Error('Unable to login')

    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Unable to login')

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User