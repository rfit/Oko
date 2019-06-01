const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Query {
    user(id: ID!): User
    currentUser: User
    users: [User]
    team(id: ID!): Team
    teams: [Team]
    invoice(id: ID!): Invoice
    invoices(teamId: ID!): [Invoice]
    allinvoices: [Invoice]
  }

  type Mutation {
    addUser(
      email: String!,
      teamId: ID!,
      password: String
    ): User
    removeUser(id: Int!): Boolean!
    addInvoice(
      invoiceId: Int!,
      invoiceDate: String!,
      teamId: ID!,
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
      excluded: Float
    ): Invoice
    deleteInvoice(id: ID!): Boolean!
    setTeamMeasurement(teamId: ID!, measurement: String): Team
    setCurrentTeam(id: ID!): User
  }

  type User {
    id: ID!
    peopleId: Int
    name: String
    email: String!
    role: String!
    currentTeam: Team
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