const pool = require('./dataBase');

class Loan{

  async getLoanType() {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM loantype WHERE loanid = $1';
      const values = [this.loanId];
      const result = await client.query(query, values);
      client.release();
      return result.rows[0];
    } catch (error) {
      console.log('Error retrieving loan type:', error);
      throw error;
    }
  }

  async updateLoanState(isPaid, installmentsPaid) {
    try {
      const client = await pool.connect();
      const query = 'UPDATE loancurrentstate SET ispaid = $1, installmentspaid = $2 WHERE stateid = $3';
      const values = [isPaid, installmentsPaid, this.stateId];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.log('Error updating loan state:', error);
      throw error;
    }
  }

  async createLoan(userId, system, currency, capital, interest, duration) {
    try {
      const client = await pool.connect();
  
      // Create loan type
      const createLoanTypeQuery = 'INSERT INTO loantype (system, currensy, capital, interest, duration) VALUES ($1, $2, $3, $4, $5) RETURNING loantypeid';
      const createLoanTypeValues = [system, currency, capital, interest, duration];
      const loanTypeResult = await client.query(createLoanTypeQuery, createLoanTypeValues);
      const loanTypeId = loanTypeResult.rows[0].loantypeid;
  
      // Create loan
      const createLoanQuery = 'INSERT INTO loans (userid, stateid, loantypeid) VALUES ($1, 1, $2) RETURNING loanid';
      const createLoanValues = [userId, loanTypeId];
      const loanResult = await client.query(createLoanQuery, createLoanValues);
      const loanId = loanResult.rows[0].loanid;
  
      // Create loan current state
      const createLoanCurrentStateQuery = 'INSERT INTO loancurrentstate (stateid, ispaid, installmentspaid) VALUES ($1, false, 0)';
      const createLoanCurrentStateValues = [loanId];
      await client.query(createLoanCurrentStateQuery, createLoanCurrentStateValues);
  
      client.release();
  
      this.loanId = loanId;
      this.loanTypeId = loanTypeId;
  
      return loanId;
    } catch (error) {
      console.log('Error creating loan:', error);
      throw error;
    }
  }
  
  
}
module.exports = Loan;  