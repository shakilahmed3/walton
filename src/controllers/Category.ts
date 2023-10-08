import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';

export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            message: "Success",
            data: null
        })
    } catch (error: any) {
        return next(createError(error));
    }
};
