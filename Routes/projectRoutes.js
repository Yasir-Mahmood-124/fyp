const express = require("express");
const { 
    createProject, 
    getUserProjects, 
    updateProject, 
    deleteProject 
} = require("../Controllers/projectController");

const { 
    createProjectMiddleware, 
    getUserProjectsMiddleware, 
    updateProjectMiddleware, 
    deleteProjectMiddleware 
} = require("../Middleware/projectMiddleware");

// Import the authMiddleware from userMiddleware.js
const { authMiddleware } = require("../Middleware/userMiddleware");

const projectRouter = express.Router();

// Create a new project
projectRouter.post("/create-project", authMiddleware, createProjectMiddleware, createProject);

// Get all projects of a user
projectRouter.get("/user-projects", authMiddleware, getUserProjectsMiddleware, getUserProjects);

// // Update a project
// projectRouter.put("/update-project/:id", authMiddleware, checkProjectOwnership, updateProjectMiddleware, updateProject);

// // Delete a project
// projectRouter.delete("/delete-project/:id", authMiddleware, checkProjectOwnership, deleteProjectMiddleware, deleteProject);

module.exports = projectRouter;
