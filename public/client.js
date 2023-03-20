console.log('client.js');


const loanForm = document.querySelector('#loan-form');
const results = document.querySelector('#results');
console.log(loginForm);

// Login form submit event listener
fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username: username, password: password })
})
.then(response => {
  if(response.redirected) {
    window.location.href = response.url;
  } else {
    const error = document.querySelector('#error');
    error.innerHTML = 'Invalid username or password';
  }
});

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  
});

// Loan form submit event listener
loanForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = document.querySelector('#amount').value;
  const duration = document.querySelector('#duration').value;

  fetch('/loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: amount, duration: duration })
  })
  .then(response => {
    if(response.status === 401) {
      window.location.href = '/login';
    } else {
      return response.json();
    }
  })
  .then(data => {
    const payment = data.payment;
    results.innerHTML = `Your monthly payment is $${payment.toFixed(2)}.`;
  });
});
