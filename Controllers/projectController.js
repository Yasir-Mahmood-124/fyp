const Project = require("../Models/projectModel");

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;
        
        const newProject = new Project({ name, description, user: userId });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getUserProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await Project.find({ user: userId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const updatedProject = await Project.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { name, description },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProject = await Project.findOneAndDelete({ _id: id, user: req.user.id });
        
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createProject, getUserProjects, updateProject, deleteProject };
