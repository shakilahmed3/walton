// controllers/Category.ts
import { NextFunction, Request, Response } from 'express';
import Category from '../models/Category';
import Joi from 'joi';
import redisClient from '../../redis';
const createError = require('http-errors')

async function getAllChild(categoryId: string): Promise<any[]> {
    const childCategories = await Category.find({ parent: categoryId });
    const childCategoryObjects: any[] = [];

    for (const child of childCategories) {
        const nestedCategories = await getAllChild(child._id);
        childCategoryObjects.push({
            ...child.toObject(),
            children: nestedCategories
        });
    }
    return childCategoryObjects;
}



export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCategoriesKey = "all_categories"

        // Check if the data is already cached in Redis
        const cachedData = await redisClient.get(allCategoriesKey);

        if (cachedData) {
            // If cached data exists, return it
            const categories = JSON.parse(cachedData);
            res.status(200).json({
                success: true,
                data: categories,
                message: "Successfully fetched from cache"
            });
        } else {
            // If data is not cached, fetch it from the database
            const rootCategories = await Category.find({ parent: null }).exec();

            const formattedCategories: any[] = [];

            for (const category of rootCategories) {
                const childCategoryObjects = await getAllChild(category._id);
                formattedCategories.push({
                    ...category.toObject(),
                    children: childCategoryObjects
                });
            }

            // Store the fetched data in Redis with an expiration time (e.g., 1 hour)
            await redisClient.set(allCategoriesKey, JSON.stringify(formattedCategories), { 'EX': 3600 });

            res.status(200).json({
                success: true,
                data: formattedCategories,
                message: "Successfully fetched from the database and cached"
            });
        }
    } catch (error) {
        return next(createError(error));
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

        await redisClient.flushAll()

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
        const cashKey = `categories${categoryId}`

        const cachedData = await redisClient.get(cashKey);

        if (cachedData) {
            // If cached data exists, return it
            const categories = JSON.parse(cachedData);
            res.status(200).json({
                success: true,
                data: categories,
                message: "Successfully retrieved category with children from cache"
            });
        } else {
            const category = await Category.findById(
                categoryId
            );

            if (!category) {
                return next(createError(404, "Category not found"));
            }

            const childCategory = await getAllChild(categoryId);

            // Store the fetched data in Redis with an expiration time (e.g., 1 hour)
            const categoriesData = {
                category,
                childCategory
            }

            await redisClient.set(cashKey, JSON.stringify(categoriesData), { 'EX': 3600 });

            res.status(200).json({
                success: true,
                data: categoriesData,
                message: "Successfully retrieved category with children",
            });
        }

    } catch (error) {
        return next(createError(error));
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

        const childCategory = await getAllChild(categoryId);

        await redisClient.flushAll()

        res.status(200).json({
            success: true,
            data: {
                category,
                childCategory
            },
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

        const searchCategoriesKey = `search_categories${categoryName}`

        // Check if the data is already cached in Redis
        const cachedData = await redisClient.get(searchCategoriesKey);

        if (cachedData) {
            // If cached data exists, return it
            const categories = JSON.parse(cachedData);
            res.status(200).json({
                success: true,
                data: categories,
                message: "Successfully search complete from cache"
            });
        } else {

            const foundCategory = await Category.findOne({ name: categoryName, isActive: true });

            if (!foundCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }

            let parentCategory = null;

            if (foundCategory.parent) {
                parentCategory = await Category.findOne({ _id: foundCategory.parent, isActive: true });
            }

            const categoriesData = {
                _id: foundCategory._id,
                name: foundCategory.name,
                parent: parentCategory,
                isActive: foundCategory.isActive,
            }

            // Store the fetched data in Redis with an expiration time (e.g., 1 hour)
            await redisClient.set(searchCategoriesKey, JSON.stringify(categoriesData), { 'EX': 3600 });

            res.status(200).json({
                success: true,
                message: "Successfully search complete",
                data: categoriesData,
            });

        }



    } catch (error) {
        return next(createError(error))
    }
};
