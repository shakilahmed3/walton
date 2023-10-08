// controllers/Category.ts
import { NextFunction, Request, Response } from 'express';
import Category from '../models/Category';
import Joi from 'joi';
const createError = require('http-errors')

//get all category
export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find().exec()
        res.status(200).json({
            success: true,
            data: categories,
            message: "Successfully"
        });
    } catch (error) {
        return next(createError(error))
    }
}

// Create a new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const joiRes = Joi.object({
            name: Joi.string().required().error(new Error("Categories name is required")),
            parentId: Joi.string().optional()
        }).validate(req.body, { abortEarly: false })

        if (joiRes.error) {
            return next(createError(400, joiRes.error))
        }
        const { name, parentId } = req.body;

        const parentCategory = parentId
            ? await Category.findById(parentId)
            : null;

        if (parentCategory && !parentCategory.isActive) {
            return next(createError(400, 'Cannot create a category under an inactive parent category'))
        }

        const isExist = await Category.findOne({ name: name })

        if (isExist) {
            return next(createError(409, 'Categories already exist!'))
        }

        const category = new Category({
            name,
            parent: parentId || null,
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category,
            message: "Create categories successfully"
        });
    } catch (error) {
        return next(createError(error))
    }
};

// Retrieve a category by ID
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return next(createError(404, "Category not found"))
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "Successfully"
        });
    } catch (error) {
        return next(createError(error))
    }
};

// Update a category by ID
export const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const joiRes = Joi.object({
            name: Joi.string(),
            isActive: Joi.boolean()
        }).validate(req.body, { abortEarly: false })

        if (joiRes.error) {
            return next(createError(400, joiRes.error))
        }
        const categoryId = req.params.id;

        const { name, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name, isActive },
            { new: true }
        );

        //if isActive equal to false then Deactivate its children
        if (isActive === false) {
            await Category.updateMany(
                { parent: categoryId },
                { isActive: false }
            );
        }

        if (!category) {
            return next(createError(404, "Category not found"))
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "Categories update successfully"

        });
    } catch (error) {
        return next(createError(error))
    }
};

// deactivate a category by ID
export const deactivateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return next(createError(404, "Category not found"))
        }

        // Deactivate the category and its children
        category.isActive = false;
        await category.save();

        await Category.updateMany(
            { parent: category._id },
            { isActive: false }
        );

        res.status(200).json({
            success: true,
            message: "Deactivate successfully"
        });
    } catch (error) {
        return next(createError(error))
    }
};


export const searchCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryName = req.params.name;

        const foundCategory = await Category.findOne({ name: categoryName, isActive: true });

        if (!foundCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let parentCategory = null;

        if (foundCategory.parent) {
            parentCategory = await Category.findOne({ _id: foundCategory.parent, isActive: true });
        }

        res.status(200).json({
            success: true,
            message: "Successfully search complete",
            data: {
                _id: foundCategory._id,
                name: foundCategory.name,
                parent: parentCategory,
                isActive: foundCategory.isActive,
            },
        });
    } catch (error) {
        return next(createError(error))
    }
};


export const getAllChildCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const childCategories = await getAllChildCategoriesRecursive(categoryId);

        res.status(200).json({
            success: true,
            data: childCategories,
            message: "Successfully retrieved all child categories",
        });
    } catch (error) {
        return next(error);
    }
};

async function getAllChildCategoriesRecursive(categoryId: any): Promise<any[]> {
    const childCategories = await Category.find({ parent: categoryId });

    if (childCategories.length === 0) {
        return [];
    }

    let allChildCategories: any[] = [];

    for (const child of childCategories) {
        allChildCategories.push(child);
        const nestedChildCategories = await getAllChildCategoriesRecursive(child._id);
        allChildCategories = allChildCategories.concat(nestedChildCategories);
    }

    return allChildCategories;
}