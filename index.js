const express = require('express');
const app = express();
const path = require('path');
const User = require('./User');
const Loan = require('./Loan');

app.use(express.json()); // Parse JSON request bodies
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  try {
    const user = new User();
    await user.createUser(username, password);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});
const accessTokens = {} ;  // Define accessTokens variable
const refreshTokens = {}; // Define refreshTokens variable

const generateToken = () => {
  const { v4: uuidv4 } = require('uuid');
  const token = uuidv4();
  console.log('token: ' + token);
  return token;
};
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('username:', username, 'password:', password); // Debug

  try {
    const user = new User();
    const foundUser = await user.getUserByUsernameAndPassword(username, password);
    console.log('foundUser:', foundUser); // Debug
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const accessToken = generateToken();
    const refreshToken = generateToken();
    
    // Store tokens and user IDs in accessTokens and refreshTokens respectively
    accessTokens[accessToken] = foundUser.userid;
    refreshTokens[refreshToken] = foundUser.userid;
    console.log('accessTokens:', accessTokens[accessToken])
    
    res.json({ accessToken, refreshToken, userId: foundUser.userid });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
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

  const userId = accessTokens[token];
  console.log('userId: ' + userId); // Debug
  if (userId) {
    req.userId = userId;
    console.log('userId: ' + userId); // Debug
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

app.post('/loan', authenticateToken, async (req, res) => {
  try {
    const { salary, installments } = req.body;
    const userId = req.userId;
    const interestRate = 0.08;
    const mInterest = interestRate / 12;

    const installment = 0.2 * salary;
    const capital = installment * ((1 - (1 / Math.pow(1 + mInterest, installments))) / mInterest);
    const totalInterest = installment * installments - capital;

    const formattedCapital = capital.toFixed(2);
    const formattedInstallment = installment.toFixed(2);
    const formattedTotalInterest = totalInterest.toFixed(2);

    // Create a new instance of Loan
    const myloan = new Loan();

    // Create a new loan in the database
    await myloan.createLoan(userId, 'french', 'USD', formattedCapital, formattedTotalInterest, installments);

    res.json({
      capital: formattedCapital,
      installment: formattedInstallment,
      totalInterest: formattedTotalInterest
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Failed to create loan' });
  }
});


app.listen(3000, () => console.log('Server started on port 3000'));


