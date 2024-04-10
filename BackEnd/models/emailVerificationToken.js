const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const verficationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  creatAt: {
    type: Date,
    expires: 600,
    default: Date.now(),
  },
});

verficationTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);

    console.log(this);
  }

  next();
});

verficationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  'verficationTokenSchema',
  verficationTokenSchema
);
