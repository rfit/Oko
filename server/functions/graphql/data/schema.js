const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model('user', new Schema({
    peopleId: Number,
    name: String,
    email: { type: String, required: true },
    role: { type: String, required: true },
    currentTeam: Team,
    teams: [Team],
    invoices: [Invoice]
}))

const Team = mongoose.model('team', new Schema({
    peopleId: { type: Number, required: true },
    name: { type: String, required: true },
    notes: String,
    measurement: String,
    users: [User],
    invoices: [Invoice]
}))

const Invoice = mongoose.model('invoice', new Schema({
    invoiceId: { type: Number, required: true },
    createdDate: String,
    invoiceDate: String,
    supplier: String,
    teamId: { type: Team, required: true },
    userId: { type: User, required: true },
    userName: String,
    eco: { type: Number, required: true },
    nonEco: { type: Number, required: true },
    total: Number
}))

module.exports = {
    User,
    Team,
    Invoice
}