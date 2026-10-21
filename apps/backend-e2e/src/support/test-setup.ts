import axios from 'axios';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ?? '3333';
axios.defaults.baseURL = `http://${host}:${port}`;
