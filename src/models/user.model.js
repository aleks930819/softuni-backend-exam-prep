const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../constants/config');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;

  const userWithPassword = await mongoose
    .model('User')
    .findById(user._id)
    .select('+password');

  if (!userWithPassword) {
    return false;
  }

  return bcrypt
    .compare(candidatePassword, userWithPassword.password)
    .catch(() => false);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
