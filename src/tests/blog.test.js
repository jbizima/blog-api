// src/models/__tests__/BlogPost.test.js
const db = require('../db');
const BlogPost = require('../models/BlogPost');

jest.mock('../db');

describe('BlogPost Model', () => {
  beforeEach(() => {
    db.query.mockClear();
  });

  test('should create a blog post', async () => {
    const postData = { title: 'Test Post', content: 'This is a test post.' };
    db.query.mockImplementation((query, data, callback) => {
      callback(null, { insertId: 1 });
    });

    const result = await BlogPost.create(postData);
    expect(result).toEqual({ insertId: 1 });
    expect(db.query).toHaveBeenCalledWith('INSERT INTO blog_posts SET ?', postData, expect.any(Function));
  });

  test('should find all blog posts', async () => {
    const mockResults = [{ id: 1, title: 'Test Post', content: 'This is a test post.' }];
    db.query.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    const results = await BlogPost.findAll();
    expect(results).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM blog_posts', expect.any(Function));
  });

  test('should find a blog post by ID', async () => {
    const mockResults = [{ id: 1, title: 'Test Post', content: 'This is a test post.' }];
    db.query.mockImplementation((query, data, callback) => {
      callback(null, mockResults);
    });

    const result = await BlogPost.findById(1);
    expect(result).toEqual(mockResults[0]);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM blog_posts WHERE id = ?', [1], expect.any(Function));
  });

  test('should update a blog post', async () => {
    const postData = { title: 'Updated Post', content: 'This is an updated post.' };
    db.query.mockImplementation((query, data, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const result = await BlogPost.update(1, postData);
    expect(result).toEqual({ affectedRows: 1 });
    expect(db.query).toHaveBeenCalledWith('UPDATE blog_posts SET ? WHERE id = ?', [postData, 1], expect.any(Function));
  });

  test('should delete a blog post', async () => {
    db.query.mockImplementation((query, data, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const result = await BlogPost.delete(1);
    expect(result).toEqual({ affectedRows: 1 });
    expect(db.query).toHaveBeenCalledWith('DELETE FROM blog_posts WHERE id = ?', [1], expect.any(Function));
  });
});
