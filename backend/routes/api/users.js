const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    try {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    } catch (error) {
      // Handle unique constraint violations
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.fields[0];
        let message = 'This account information is already in use.';
        
        if (field === 'username') {
          message = 'Username is already taken. Please choose a different username.';
        } else if (field === 'email') {
          message = 'Email is already registered. Please use a different email or try logging in.';
        }
        
        return res.status(400).json({
          message,
          errors: { [field]: message }
        });
      }
      
      // Handle other errors
      console.error('Registration error:', error);
      return res.status(500).json({
        message: 'An error occurred during registration. Please try again.'
      });
    }
  }
);

module.exports = router;