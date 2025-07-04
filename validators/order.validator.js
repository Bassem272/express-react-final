import { body } from 'express-validator';

export const orderValidation = [
  // body('user')
  //   .notEmpty().withMessage('User is required')
  //   .isMongoId().withMessage('User must be a valid MongoDB ID'),

  // body('orderItems')
  //   .isArray({ min: 1 }).withMessage('orderItems must be a non-empty array'),

  // body('orderItems.*.name')
  //   .notEmpty().withMessage('Item name is required')
  //   .isString().withMessage('Item name must be a string'),

  // body('orderItems.*.quantity')
  //   .notEmpty().withMessage('Quantity is required')
  //   .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  // body('orderItems.*.price')
  //   .notEmpty().withMessage('Price is required')
  //   .isNumeric().withMessage('Price must be a number'),

  // body('orderItems.*.product')
  //   .notEmpty().withMessage('Product ID is required')
  //   .isString().withMessage('Product must be a string'),

  // body('orderItems.*.image')
  //   .optional()
  //   .isString().withMessage('Image must be a string'),

  // body('totalCost')
  //   .optional()
  //   .isNumeric().withMessage('Total cost must be a number'),
];
