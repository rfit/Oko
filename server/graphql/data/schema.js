const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectId = Schema.Types.ObjectId;

const User = mongoose.model('user', new Schema({
    _id: Number,
    peopleId: Number,
    name: String,
    email: { type: String, required: true },
    role: { type: String, required: true },
    currentTeam: { type: ObjectId, ref: 'team' },
    teams: [{ type: ObjectId, ref: 'team' }],
    invoices: [{ type: ObjectId, ref: 'invoice' }]
}));

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

module.exports = {
    User,
    Team,
    Invoice
};