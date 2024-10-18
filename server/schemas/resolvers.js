const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      return null;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        return null;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, {bookData}, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true, runValidators: true }
          );

        return updatedUser;
      };
      return null;
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );
          return updatedUser;
      }
      return null;
    },
  },
};

module.exports = resolvers;
