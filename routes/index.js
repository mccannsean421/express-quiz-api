const express = require('express');
const router = express.Router();
const QuestionModel = require('../models/Question');
const CategoryModel = require('../models/Category');
const { body, check, validationResult } = require('express-validator');

/**
 * get all quiz questions
 */
router.get('/questions', async (req, res) => {
  const questions = await QuestionModel.find()
  return res.status(200).json(questions)
});

/**
 * Create a new question
 * @param {string} question - The actual text of the question
 * @param {boolean} is_active - Whether or not the question should be shown
 * @param {array} choices - An array of possible answers
 * @param {array} categories - Categories this question belongs under
 */
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
