const form = document.querySelector('#loan-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const salary = document.querySelector('#salary').value;
  const installments = document.querySelector('#installments').value;

  fetch('/loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ salary: salary, installments: installments })
  })
  .then(response => response.json())
  .then(data => {
    const results = document.querySelector('#results');
    results.innerHTML = `
      <h2>Loan Details:</h2>
      <p>Capital: $${data.capital}</p>
      <p>Monthly Installment: $${data.installment}</p>
      <p>Total Interest: $${data.totalInterest}</p>
    `;
  });
});
