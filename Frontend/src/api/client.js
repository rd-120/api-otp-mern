import axios from 'axios';
const client = axios.create({ baseURL: 'api-otp-mern.vercel.app/api' });

export default client;
