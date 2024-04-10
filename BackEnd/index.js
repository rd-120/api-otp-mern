express = require('express');
require('./db/index');
const userRouter = require('./routes/user');
require('./models/user');
require('express-async-errors');
require('dotenv').config();
const { errorHandler } = require('./middlewares/error');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '[]',
    methods: ['POST', 'GET'],
    credentials: true,
  }));

app.use(express.json());
// const PORT = process.env.PORT || 800;
app.use('/api/user', userRouter);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.json('Hello');
});
// app.use('/*');

// app.use('/*', (req, res) => {
//   return res.status(401).json({ error: 'not found' });
// });

// app.post(
//   '/sign-in',
//   (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.json({ erorr: 'email/password are missing' });
//     next();
//   },
//   (req, res) => {
//     res.send('<h1>hi im from the backend please</h1>');
//   }
// );

app.listen(3000, () => {
  console.log('the port is listening in 3000');
});
