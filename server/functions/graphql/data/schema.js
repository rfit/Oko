const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Query {
    user(id: ID!): User
    users: [User]
    team(id: ID!): Team
    teams: [Team]
    invoice(id: ID!): Invoice
    invoices(teamId: String!): [Invoice]
  }

  type Mutation {
    addUser(
        peopleId: String,
        email: String
    ): User!
    removeUser(_id: ID!): Boolean!
    createInvoice(
      invoiceId: Int!,
      invoiceDate: String!,
        "Firebase ID reference: teams/_id"
      teamId: String!,
      eco: Float,
      nonEco: Float,
      excluded: Float,
      total: Float
    ): Invoice!
    updateInvoice(
      _id: ID!,
      invoiceId: Int,
      invoiceDate: String,
      eco: Float,
      nonEco: Float,
      excluded: Float,
      total: Float
    ): Invoice!
    deleteInvoice(_id: ID!): Boolean!

  }

  type User {
      "Firebase user id"
    id: ID!
    peopleId: Int!
    name: String!
    email: String!
    teams: [Team]
  }

  type Team {
      "Firebase team id"
    id: ID!
    peopleId: Int!
    name: String!
    measurement: String
    users: [User]
    invoices: [Invoice]
  }

  type Invoice {
      "Firebase invoice id"
    id: ID!
    invoiceId: Int!
    createdDate: String
    invoiceDate: String
      "Firebase ID reference: teams/_id"
    teamId: String!
    eco: Float!
    nonEco: Float!
    excluded: Float!
    total: Float
  }

`;

module.exports = typeDefs;