const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.URI;

console.log();
async function connect() {
  try {
    await mongoose.connect("mongodb+srv://desta:GKk0TIOTXPezpDOS@myapp.nhse7fb.mongodb.net/?retryWrites=true&w=majority&appName=MyApp");
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('could not connect', error);
  }
}

connect();
