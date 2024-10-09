const { body } = require('express-validator');

const validateCreaturePostRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('species')
      .notEmpty()
      .withMessage('Species is required.')
      .isLength({ min: 3 })
      .withMessage('Species must be at least 3 characters long'),

    body('image')
      .notEmpty()
      .withMessage('Creature image is required.')
      .matches(/^https?:\/\//)
      .withMessage('Creature image must start with http:// or https://'),

    body('skinColor')
      .notEmpty()
      .withMessage('Skin color is required.')
      .isLength({ min: 3 })
      .withMessage('Skin color must be at least 3 characters long'),

    body('eyeColor')
      .notEmpty()
      .withMessage('Eye color is required.')
      .isLength({ min: 3 })
      .withMessage('Eye color must be at least 3 characters long'),

    body('description')
      .notEmpty()
      .withMessage('Description is required.')
      .isLength({ min: 5, max: 500 })
      .withMessage('Description must be between 5 and 500 characters long'),
  ];
};
module.exports = {
  validateCreaturePostRules,
};
