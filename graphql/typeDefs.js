const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String
    imageUrl: String
    createdAt: String!
    token: String
    latestMessage: Message
  }

  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  type Reaction {
    content: String!
    uuid: String!
    message: Message!
    user: User!
    createdAt: String!
  }

  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
    currentUser: User!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(messageUuid: String!, content: String!): Reaction!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;
