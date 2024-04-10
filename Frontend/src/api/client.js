import axios from 'axios';
const client = axios.create({ baseURL:'https://api-otp-mern.vercel.app/api/user'});

export default client;
