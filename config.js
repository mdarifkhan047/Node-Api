const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  NODE_ENV: 'development',
  endpoint: process.env.API_URL='http://localhost:8000/api/user/3',
  masterKey: process.env.API_KEY,
  port: process.env.PORT=8080
 
};