// src/models/User.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = {
  create: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', userData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findById: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  update: (userId, userData) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET ? WHERE id = ?', [userData, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  delete: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findByResetToken: (resetToken) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE reset_token = ?', [resetToken], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },
  generateVerificationToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

};

module.exports = User;