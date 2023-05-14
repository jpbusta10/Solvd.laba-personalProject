const request = require('supertest');
const app = 'http://localhost:3000';
const assert = require('assert');
const pool = require('../src/dataBase');
describe('Server', () => {
  let accessToken;
  let refreshToken;
  let userId;
  let loanId;
  let stateId;
  let loanTypeId;
  

  it('should create a new user on POST /signup', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpassword' });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { message: 'User created successfully' });
  });

  it('should return access and refresh tokens on POST /login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    assert.strictEqual(response.status, 200);
    assert.ok(response.body.accessToken);
    assert.ok(response.body.refreshToken);

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  it('should create a new loan on POST /loan', async () => {
    const response = await request(app)
      .post('/loan')
      .set('Accept', '*/*')
      .set('User-Agent', 'Thunder Client (https://www.thunderclient.com)')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Refresh-Token', refreshToken)
      .send({ salary: 5000, installments: 12 });

    assert.strictEqual(response.status, 200);
    assert.ok(response.body.capital);
    assert.ok(response.body.installment);
    assert.ok(response.body.totalInterest);

    loanId = response.body.loanId;
    userId = response.body.userId;
    stateId = response.body.stateId;
    loanTypeId = response.body.loanTypeId;
  });

  after(async () => {
    try {
      console.log('Cleaning up...');
      const client = await pool.connect();
      const deleteLoanCurrentStateQuery = 'DELETE FROM loancurrentstate WHERE stateid = $1';
      await client.query(deleteLoanCurrentStateQuery, [stateId]);
  
      const deleteLoanQuery = 'DELETE FROM loans WHERE loanid = $1';
      await client.query(deleteLoanQuery, [loanId]);
  
      const deleteLoanTypeQuery = 'DELETE FROM loantype WHERE loantypeid = $1';
      await client.query(deleteLoanTypeQuery, [loanTypeId]);
  
      const deleteUserQuery = 'DELETE FROM users WHERE userid = $1';
      await client.query(deleteUserQuery, [userId]);
  
      client.release();
      console.log('Clean up completed');
    } catch (error) {
      console.log('Error during cleanup:', error);
      throw error;
      done();
    }
  });
  
  
});

