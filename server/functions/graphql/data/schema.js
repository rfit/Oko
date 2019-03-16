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
      teamId: String!
    ): Invoice!
    updateInvoice(
      _id: ID!,
      invoiceId: Int,
      invoiceDate: String
    ): Invoice!
    deleteInvoice(_id: ID!): Boolean!

  }

  type User {
      "Firebase id"
    id: ID!
    peopleId: Int!
    memberName: String!
    email: String!
    roleName: String!
    teams: [Team]
  }

  type Team {
      "Firebase id"
    id: ID!
    peopleId: Int!
    name: String!
    users: [User]
    invoices: [Invoice]
  }

  type Invoice {
      "Firebase id"
    id: ID!
    invoiceId: Int!
    createdDate: String
    invoiceDate: String
      "Firebase ID reference: teams/_id"
    teamId: String!
  }


`;

module.exports = typeDefs;