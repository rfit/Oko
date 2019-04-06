const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Query {
    user(id: ID!): User
    users: [User]
    team(id: ID!): Team
    teams: [Team]
    invoice(id: ID!): Invoice
    invoices(teamId: Int!): [Invoice]
    allinvoices: [Invoice]
  }

  type Mutation {
    addUser(
      email: String!,
      teamId: Int!
    ): User
    removeUser(id: Int!): Boolean!
    addInvoice(
      invoiceId: Int!,
      invoiceDate: String!,
      teamId: Int!,
      userId: Int!,
      userName: String,
      eco: Float!,
      nonEco: Float!,
      excluded: Float!
    ): Invoice
    updateInvoice(
      id: ID!,
      invoiceId: Int,
      invoiceDate: String,
      eco: Float,
      nonEco: Float,
      excluded: Float,
      total: Float
    ): Invoice!
    deleteInvoice(id: ID!): Boolean!
    setTeamMeasurement(teamId: Int!, measurement: String): Boolean
  }

  type User {
    id: ID
    peopleId: Int!
    name: String!
    email: String!
    role: String!
    teams: [Team]
    invoices: [Invoice]
  }

  type Team {
    id: ID!
    peopleId: Int!
    name: String!
    measurement: String
    users: [User]
    invoices: [Invoice]
  }

  type Invoice {
      "Firebase invoice id"
    id: ID
    invoiceId: Int!
    createdDate: String
    invoiceDate: String
    teamId: Int!
    userId: Int!
    userName: String
    eco: Float!
    nonEco: Float!
    excluded: Float!
    total: Float
  }

`;

module.exports = typeDefs;