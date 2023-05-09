const express = require('express');
const app = express();
const path = require('path');

app.use(express.json()); // Parse JSON request bodies
app.post('/signup', (req, res) => {
  const { username, password, } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  
});

const users = [
  {id:1, username: 'user1', password: '1234'},
  {id:2, username: 'user2', password: 'password2'},
  {id:3, username: 'user3' , password: 'password3'},
];

const accessTokens = {};  // Define accessTokens variable
const refreshTokens = {}; // Define refreshTokens variable

const generateToken = () => {
  const { v4: uuidv4 } = require('uuid');
  const token = uuidv4();
  console.log('token: ' + token);
  return token;
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('username:', username, 'password:', password); // Debug
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const accessToken = generateToken();
  const refreshToken = generateToken();
  accessTokens[accessToken] = user.id; // Use accessTokens instead of tokens
  refreshTokens[refreshToken] = user.id; // Use refreshTokens instead of tokens
  res.json({ accessToken: accessToken, refreshToken: refreshToken, userId: user.id });
});

const authenticateToken = (req, res, next) => {
  console.log('auth token');
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const [tokenType, token] = authHeader.split(' ');
  if (tokenType !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token type' });
  }

  const userId = accessTokens[token]; // Corrected variable name
  if (userId) {
    req.userId = userId;
    return next();
  }

  const refreshTokenData = refreshTokens[token];
  if (!refreshTokenData) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const newAccessToken = generateToken();
  accessTokens[newAccessToken] = refreshTokenData;
  delete accessTokens[token];

  res.set('Authorization', `Bearer ${newAccessToken}`);
  res.set('Refresh-Token', token);
  req.userId = refreshTokenData;
  next();
};


app.post('/loan', authenticateToken, (req, res) => {
  const { salary, installments } = req.body;

  const interestRate = 0.08;
  const mInterest = interestRate / 12;

  const installment = 0.2 * salary;
  const capital = installment * ((1 - (1 / Math.pow(1 + mInterest, installments))) / mInterest);
  const totalInterest = installment * installments - capital;

  const formattedCapital = capital.toFixed(2);
  const formattedInstallment = installment.toFixed(2);
  const formattedTotalInterest = totalInterest.toFixed(2);

  res.json({
    capital: formattedCapital,
    installment: formattedInstallment,
    totalInterest: formattedTotalInterest
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));


