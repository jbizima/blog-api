const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const config = require('../../config'); // Assuming config file for email settings
const authMiddleware = require('../middleware/auth');
// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      is_verified: false, // Initially set to false
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    user.verification_token = verificationToken;

    await user.save(); // Assuming a save method in your User model

    // Send verification email
    const transporter = nodemailer.createTransport(config.email);
    const mailOptions = {
      from: config.email.auth.user, // Use configured sender email
      to: user.email,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking this link: http://your-app-url/verify-email/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log(`Verification email sent: ${info.response}`);
      }
    });

    res
      .status(201)
      .json({ message: 'User created successfully, please verify your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Update user with reset token and expiration
    user.reset_token = resetToken;
    user.reset_token_expiration = Date.now() + 3600000; // 1 hour
    await User.update(user.id, user);

    // Send password reset email
    const transporter = nodemailer.createTransport(config.email);
    const mailOptions = {
      from: config.email.auth.user, // Use configured sender email
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this email because you requested a password reset. Please click the following link to reset your password: http://your-app-url/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findByResetToken(token); // Implement findByResetToken method
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(400).json({ error: 'Email not verified' });
    }

    // Check token expiration
    if (user.reset_token_expiration < Date.now()) {
      return res.status(400).json({ error: 'Token expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expiration = null;
    await User.update(user.id, user);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email
router.post('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findByVerificationToken(token); // Implement this method in your User model
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Verify user
    user.is_verified = true;
    user.verification_token = null;
    await User.update(user.id, user);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
