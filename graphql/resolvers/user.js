const { Message, User } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.json");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    currentUser: async (_, __, { user }) => {
      const me = await User.findOne({
        where: {
          username: user.username,
        },
      });

      return me;
    },
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: {
            username: {
              [Op.ne]: user.username,
            },
          },
        });

        const allUsersMessage = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUsersMessage.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad Input", { errors });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is not correct", { errors });
        }
        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60,
        });

        user.token = token;

        return {
          ...user.toJSON(),
          token,
          // createdAt: user.createdAt.toISOString(),
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        // validate the user input data
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (email.trim() === "") errors.email = "email must not be empty";
        if (password.trim() === "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "repeat password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "passwords must match";
        // check if username and email exists or not
        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        //hash the password before save into the databasse
        password = await bcrypt.hash(password, 6);

        // if user is not exist create user
        const user = await User.create({
          username,
          email,
          password,
        });

        return user;
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach((e) => {
            key = e.path.split(".")[1];
            errors[key] = `${key} is already taken`;
          });
        }
        if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};
