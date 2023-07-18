const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.Secret;

const sign = (payload) => jwt.sign(payload, secret);
const verify = (payload) => jwt.verify(payload, secret);

module.exports = {
  sign,
  verify
};