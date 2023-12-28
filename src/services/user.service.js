const User = require("../models/User");

const userService = {
  createNewUser: async (user) => {
    const newUser = new User(user);
    await newUser.save();
  },

  findById: async (id) => {
    const user = await User.findById(id);
    if (user) {
      return user;
    } else {
      return null;
    }
  },

  findByEmail: async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    } else {
      return null;
    }
  },

  recoveryPassword: async (email, token) => {
    const user = await User.findOne({
      email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  },
};

module.exports = userService;
