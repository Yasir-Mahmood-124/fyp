// middleware/requestValidator.js
const validateGenerateErdRequest = (req, res, next) => {
    if (!req.body || !req.body.requirements) {
        return res.status(400).json({ error: 'Requirements are missing in the request body.' });
    }
    next();
};

module.exports = { validateGenerateErdRequest };