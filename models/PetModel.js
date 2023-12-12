const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    }, 
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'fostered', 'adopted'],
        default: 'available',
        required: true,
        trim: true,
    },
    picture: {
        type: String,
        required: true,
        trim: true
    },
    height: {
        type: Number,
        trim: true
    },
    weight: {
        type: Number,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    hypoallergenic: {
        type: Boolean,
        required: true,
        default: false
    },
    dietaryRestrictions: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    toBeReturned: {
        type: Boolean,
        required: true,
        default: false
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fostererId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
    });

    const Pet = mongoose.model('Pet', petSchema);

    module.exports = Pet;