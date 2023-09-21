
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("token recieved",authHeader);
    console.log("old token",JWT_SECRET_KEY);
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    console.log("user valid");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
module.exports = { verifyToken };

