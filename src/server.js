const express = require('express');
const { db } = require('./db');
const { users, posts } = require('./db/schema.js');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Create user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await db.insert(users).values({ name, email }).returning();
    res.status(201).json({
      message: 'User created successfully!',
      user: result[0],
    });
  } catch (err) {
    if (err.cause?.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({
      error: 'Failed to create user',
      details: 'Something went wrong while saving the user. Please try again.',
    });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res
        .status(400)
        .json({ error: 'title, content, and userId are required' });
    }

    const result = await db
      .insert(posts)
      .values({ title, content, userId })
      .returning();

    res.status(201).json({
      message: 'Post created successfully!',
      post: result[0],
    });
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({
      error: 'Failed to create post',
      details: err.message,
    });
  }
});

// ✅ Get all users
app.get('/users', async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
