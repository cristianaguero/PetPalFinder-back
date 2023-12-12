const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        // required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    token: {
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    savedPets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    fosteredPets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    adoptedPets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;