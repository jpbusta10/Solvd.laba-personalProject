const pool = require('./dataBase');

class User {

  async createUser(username, password) {
    try {
      const client = await pool.connect();
      const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
      const values = [username, password];
      const result = await client.query(query, values);
      const insertedUser = result.rows[0]; // Get the inserted user record
      client.release();
      return insertedUser;
    } catch (error) {
      console.log("Error creating user:", error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE id = $1';
      const values = [userId];
      const result = await client.query(query, values);
      client.release();
      return result.rows[0];
    } catch (error) {
      console.log("error getting user");
      throw error;
    }
  }

  async getUserByUsernameAndPassword(username, password) {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await client.query(query, values);
      client.release();

      if (result.rows.length === 0) {
        // User with the provided username doesn't exist
        return null;
      }

      const user = result.rows[0];
      if (password === user.password) {
        // Password matches, return the user
        return user;
      } else {
        // Password doesn't match
        return null;
      }
    } catch (error) {
      console.log("Error retrieving user:", error);
      throw error;
    }
  }

}

module.exports = User;
