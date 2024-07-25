// src/models/BlogPost.js
const db = require('../db');

const BlogPost = {
  create: (postData) =>
    new Promise((resolve, reject) => {
      db.query('INSERT INTO blog_posts SET ?', postData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),

  findAll: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM blog_posts', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    }),

  findById: (postId) =>
    new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM blog_posts WHERE id = ?',
        [postId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        },
      );
    }),

  update: (postId, postData) =>
    new Promise((resolve, reject) => {
      db.query(
        'UPDATE blog_posts SET ? WHERE id = ?',
        [postData, postId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    }),

  delete: (postId) =>
    new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM blog_posts WHERE id = ?',
        [postId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    }),
};

module.exports = BlogPost;
