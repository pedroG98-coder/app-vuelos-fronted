import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // endpoint para consumir backend.
});

export default api;