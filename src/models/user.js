const mongoose = require('mongoose')
const validator = require('validator')

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

//userSchema.statics
//modelSchema.methods
//modelSchema.pre('save')  //save, remove, etc

const User = mongoose.model('User', userSchema)

module.exports = User