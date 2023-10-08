import {
    createCategory,
    deactivateCategoryById,
    getAllCategory,
    getCategoryById,
    updateCategoryById
} from "../controllers/Category";

const express = require('express');
const router = express.Router();


//get all category
router.get('/', getAllCategory);
// Create a new category
router.post('/', createCategory);
// Retrieve a category by ID
router.get('/:id', getCategoryById);
// Update a category by ID
router.put('/:id', updateCategoryById);
// Delete a category by ID
router.delete('/:id', deactivateCategoryById);

module.exports = router;

