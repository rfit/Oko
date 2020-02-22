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
    addUser(email: String!, teamId: ID!, password: String): User
    removeUser(id: Int!): Boolean!
    addInvoice(
      invoiceId: ID!
      invoiceDate: String!
      supplier: String!
      teamId: ID!
      eco: Float!
      nonEco: Float!
      excluded: Float!
    ): Invoice
    updateInvoice(
      id: ID!
      invoiceId: ID
      invoiceDate: String
      supplier: String
      eco: Float
      nonEco: Float
      excluded: Float
    ): Invoice
    deleteInvoice(id: ID!): Boolean!
    setTeamMeasurement(teamId: ID!, measurement: String): Team
    setCurrentTeam(id: ID!): User
    setNotes(teamId: ID!, notes: String): Team
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
    "General notes about this team"
    notes: String
    "KG or KR, how do this team measure?"
    measurement: String
    users: [User]
    invoices: [Invoice]
  }

  type Invoice {
    "Firebase invoice id"
    id: ID
    invoiceId: ID!
    createdDate: String
    invoiceDate: String
    supplier: String
    teamId: ID!
    userId: ID!
    userName: String
    eco: Float!
    nonEco: Float!
    excluded: Float!
    total: Float
  }
`;

module.exports = typeDefs;
