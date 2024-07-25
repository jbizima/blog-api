require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const blogPostRoutes = require('./routes/blogPosts');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/blog-posts', blogPostRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
