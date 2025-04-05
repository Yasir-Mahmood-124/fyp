const Joi = require("joi");

// Joi Schema for Project Validation
const projectSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.base": "Project name must be a string.",
        "string.min": "Project name must be at least 3 characters long.",
        "any.required": "Project name is required."
    }),
    description: Joi.string().optional().messages({
        "string.base": "Description must be a string."
    })
});

// Middleware for Creating a Project
const createProjectMiddleware = (req, res, next) => {
    const { error } = projectSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            success: false,
            errors: error.details.map((err) => err.message)
        });
    }

    next();
};

// Middleware for Fetching User's Projects (Just checking if user is authenticated)
const getUserProjectsMiddleware = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    next();
};

// Middleware for Updating a Project
const updateProjectMiddleware = (req, res, next) => {
    const { error } = projectSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            success: false,
            errors: error.details.map((err) => err.message)
        });
    }
    next();
};

// Middleware for Deleting a Project (No need to check if user exists again here)
const deleteProjectMiddleware = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    next();
};

module.exports = { createProjectMiddleware, getUserProjectsMiddleware, updateProjectMiddleware, deleteProjectMiddleware };
