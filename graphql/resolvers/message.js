const { User, Message } = require("../../models");
const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = await User.findOne({ where: { username: from } });
        if (!otherUser) throw new UserInputError("User not found!!");

        const usernames = [user.username, otherUser.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });

        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user, pubsub }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        if (content.trim() === "") throw new UserInputError("Message is empty");

        if (to === user.username)
          throw new UserInputError("You can't message yourself");

        const receipent = await User.findOne({ where: { username: to } });

        if (!receipent) {
          throw new UserInputError("User not found");
        }

        const message = await Message.create({
          content,
          to,
          from: user.username,
        });
        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        return message;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        (parent, _, { user }) => {
          if (
            parent.newMessage.from === user.username ||
            parent.newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
