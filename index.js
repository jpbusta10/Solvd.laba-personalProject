const express = require('express');
const app = express();
const path = require('path');

const users = [
  {id:1, username: 'user1', password: '1234'},
  {id:2, username: 'user2', password: 'password2'},
  {id:3, username: 'user3' , password: 'password3'},
];

const tokens = {};

const generateToken = () => {
  const uuid = require('uuid');
  const token = uuid.v4();
  console.log('token: '+token);
  return token;
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: 'login.html' }));


app.post('/login',(req, res)=>{
  console.log(req.body);
  const {username, password} = req.body;
  console.log('username:', username, 'password:', password); /// debug
  const user = users.find(u => u.username === username && u.password === password);
  if (!user){
    return res.status(401).json({message: 'invalid username or password'});
  }
  const token = generateToken();
  tokens[token] = user.id;
  res.cookie('token', token); // Set token as cookie
  res.redirect('/index.html'); // Redirect to index.html after successful login
});


const authenticateToken  = (req, res, next) => {
  console.log('auth token');
  const token = req.headers['authorization'];
  if (!token){
    return res.status(401).json({message: 'unauthorized'});
  }
  const userid = tokens[token];
  if (!userid){
    return res.status(401).json({message: 'invalid token'});
  }
  req.userid = userId;
  next();
};

app.post('/loan', authenticateToken , (req, res) => {
  let salary = req.body.salary;
  let n = req.body.installments;

  let interestRate = 0.08;
  let mInterest = interestRate / 12;

  let installment = 0.2 * salary;
  let capital = installment * ((1 - (1 / Math.pow(1 + mInterest, n))) / mInterest);
  let totalInterest = (installment * n) - capital;

  capital = capital.toFixed(2);
  installment = installment.toFixed(2);
  totalInterest = totalInterest.toFixed(2);

  res.json({
    capital: capital,
    installment: installment,
    totalInterest: totalInterest
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
