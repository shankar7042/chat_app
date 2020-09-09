const { User, Message } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
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
    sendMessage: async (parent, { to, content }, { user }) => {
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

        return message;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
