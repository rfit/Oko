const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Query {
    user(id: ID!): User
    users: [User]
    team(id: ID!): Team
    teams: [Team]
    bill(id: ID!): Bill
    bills: [Bill]
    login(user: String!): Boolean!
  }

  type Mutation {
    createTeam(
        teamId: String!, 
        teamName: String!,
        teamParentId: String,
        CopyOfTeamId: String
    ): Team!
    deleteTeam(teamId: String!): Boolean!
    createUser(
        memberId: String,
        memberNumber: String,
        memberName: String,
        email: String,
        roleName: String,
        teamId: String
    ): User!
    deleteUser(memberId: String!): Boolean!
    createBill(
      id: ID!,
      oko: String,
      nonoko: String,
      teamId: String
    ): Bill!
    deleteBill(id: ID!): Boolean!
  }

  type Login {
    user: String!
    password: String!
  }

  type User {
    memberId: String
    memberNumber: String
    memberName: String
    email: String
    roleName: String
    teamId: String
    team: Team!
    teams: [Team]
    username: String
  }

  type Team {
    teamId: String
    teamName: String
    teamParentId: String
    CopyOfTeamId: String
    users: [User]
    bills: [Bill]
  }

  type Bill {
    id: ID!
    created: String
    oko: String
    nonoko: String
    teamId: String
  }

`;

module.exports = typeDefs;