const messagesResolver = require("./message");
const usersResolver = require("./user");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...messagesResolver.Query,
    ...usersResolver.Query,
  },
  Mutation: {
    ...messagesResolver.Mutation,
    ...usersResolver.Mutation,
  },
};
