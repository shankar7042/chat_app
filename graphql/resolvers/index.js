const messagesResolver = require("./message");
const usersResolver = require("./user");
const { User, Message } = require("../../models");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    message: async (parent) => await Message.findByPk(parent.messageId),
    user: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ["username", "imageUrl", "createdAt"],
      }),
  },
  Query: {
    ...messagesResolver.Query,
    ...usersResolver.Query,
  },
  Mutation: {
    ...messagesResolver.Mutation,
    ...usersResolver.Mutation,
  },
  Subscription: {
    ...messagesResolver.Subscription,
  },
};
