const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');

function getRandomCities(cities, num) {
  const result = [];
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * cities.length);
    result.push(cities[randomIndex]);
  }
  return result;
}

exports.create = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser)
    return res.status(401).json({ error: 'This email is already in use!' });

  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit otp
  // let OTP = '';
  // for (let i = 1; i <= 6; i++) {
  //   const randomVal = Math.round(Math.random() * 9);
  //   OTP += randomVal;
  // }

  // console.log(OTP);

  /// generate 6 digit otp from Api OpenWheather
  const apiKey = process.env.API_KEY;

  const citiesResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/box/city?bbox=12,32,15,37,10&appid=${apiKey}&units=metric`
  );
  const cities = citiesResponse.data.list.map((city) => city.name);

  const randomCities = getRandomCities(cities, 3); // choosing 3 random cities from the list

  let OTP = '';
  for (let i = 0; i < randomCities.length; i++) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${randomCities[i]}&appid=b4fd7ad9e9ad0beb4a0e76968750f2b5&units=metric`
    );

    const temperature = response.data.main.temp;

    let formattedTemp = Math.abs(Math.round(temperature));
    if (formattedTemp < 10) {
      OTP += '0';
    }
    OTP += formattedTemp.toString().slice(0, 2);
  }

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send that otp to our user

  let transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'cb0934bb082c57',
      pass: 'cf0efb7ca575a2',
    },
  });

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: newUser.email,
    subject: 'Email Verification',
    html: `
      <p>Your verification OTP Will Be Valid For 5 min</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP, name } = req.body;

  if (!isValidObjectId(userId)) return res.json({ error: 'Invalid user!' });

  const user = await User.findById(userId);
  if (!user) return res.json({ error: 'user not found!' });

  if (user.isVerified) return res.json({ error: 'user is already verified!' });

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return res.json({ error: 'token not found!' });

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return res.json({ error: 'Please submit a valid OTP!' });

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  let transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'cb0934bb082c57',
      pass: 'cf0efb7ca575a2',
    },
  });

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Welcome to our app',
    html: `<h1> ${user.name} welcome to our app</h1>
     
    `,
  });

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
    },
    message: 'Your email is verified.',
  });
};

// exports.signIn = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return sendError(res, 'Email/Password mismatch!');

//   const matched = await user.comparePassword(password);
//   if (!matched) return sendError(res, 'Email/Password mismatch!');

//   const { _id, name, isVerified } = user;

//   const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_KEY);

//   res.json({
//     user: { id: _id, name, email, token: jwtToken, isVerified },
//   });
// };
