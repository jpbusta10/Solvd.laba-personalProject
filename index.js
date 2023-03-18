const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let salary = 0;
  let capital = 0;
  let installment = 0;
  let n = 0; //number of monthly installments
  let interestRate = 0.08; ///fixed interest rate
  mInterest = interestRate / 12;//get the monthly interest
  let totalInterest = 0;
  
  readline.question('Enter your monthly salary: ', (salaryInput) => {
    salary = parseFloat(salaryInput);
    installment = 0.2 * salary;  //the installment can only be 20% of the salary
    readline.question('Enter the number of monthly installments you require: ', (nInput) => {
      n = parseInt(nInput);
      capital = installment * ((1-(1/Math.pow(1+mInterest, n)))/mInterest);
      totalInterest = (installment * n) - capital;
      capital = capital.toFixed(2);
      installment = installment.toFixed(2);
      totalInterest = totalInterest.toFixed(2);
      console.log('Under French amortization system:\nCapital: ' + capital + '\nInstallment: ' + installment + '\nTotal interest: ' + totalInterest + '\nanual Interest rate: ' + interestRate*100+'%');
      readline.close();
    });
  });
  