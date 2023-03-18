const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public', { index: 'index.html' }));

app.post('/loan', (req, res) => {
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
