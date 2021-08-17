const express = require('express');
const router = express.Router();
const QuestionModel = require('../models/Question');
const CategoryModel = require('../models/Category');
const UserModel = require('../models/User');
const { body, check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth");
require('dotenv').config();

router.get('/', auth, async (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// User Registration
router.post(
  '/register',
  body('name').notEmpty().trim().escape(),
  body('email').notEmpty().trim().escape(),
  body('password').notEmpty().trim().escape(),
  async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // Error handling
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);

  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

/**
 * get all quiz questions
 */
router.get('/questions', async (req, res) => {
  const questions = await QuestionModel.find()
  return res.status(200).json(questions)
});

// Create a new question
router.post(
  '/questions',
  body('question').notEmpty().trim().escape(),
  body('choices').notEmpty(),
  body('is_active').notEmpty(),
  async (req, res, next) => {
  try {
    const { question, is_active} = req.body;
    const q = await QuestionModel.create(req.body);

    // Error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      // Success
      return res.status(201).json(q)
    }

  } catch (error) {
    next(error);
  }
});

// Delete a question
router.delete(
  '/questions',
  body('id').notEmpty().trim().escape(),
  async (req, res) => {

  try {
    const q = await QuestionModel.deleteOne({ _id: req.body.id });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      // Success
      return res.status(201).json(q)
    }
  } catch(error) {
    return res.status(400).json({ errors: error});
  }
});

/**
 * Get all Categories
 */
router.get('/categories', async (req, res) => {
  const categories = await CategoryModel.find()
  return res.status(200).json(categories)
});

module.exports = router;
