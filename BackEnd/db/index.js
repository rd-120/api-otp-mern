const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.URI;

console.log();
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('could not connect', error);
  }
}

connect();
