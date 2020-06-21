const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createDefaultUsers } = require('../migration');
const { Schema } = mongoose;

const SALT_WORK_FACTOR = 10;

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    peopleId: Number,
    name: String,
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    currentTeam: { type: ObjectId, ref: 'team' },
    teams: [{ type: ObjectId, ref: 'team' }],
    invoices: [{ type: ObjectId, ref: 'invoice' }]
})

userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('user', userSchema);

const Team = mongoose.model('team', new Schema({
    peopleId: { type: Number, required: true },
    name: { type: String, required: true },
    notes: String,
    measurement: String,
    users: [{ type: ObjectId, ref: 'user' }],
    invoices: [{ type: ObjectId, ref: 'invoice' }]
}));

const Invoice = mongoose.model('invoice', new Schema({
    invoiceId: { type: Number, required: true },
    createdDate: String,
    invoiceDate: String,
    supplier: String,
    teamId: { type: ObjectId, ref: 'team', required: true },
    userId: { type: ObjectId, ref: 'user', required: true },
    userName: String,
    eco: { type: Number, required: true },
    nonEco: { type: Number, required: true },
    total: Number
}));

// Migrate default users to database
createDefaultUsers(User);

module.exports = {
    User,
    Team,
    Invoice
};
