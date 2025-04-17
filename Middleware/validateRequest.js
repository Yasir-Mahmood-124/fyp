// Middleware to validate the request body
module.exports = (req, res, next) => {
    const { requirements } = req.body;
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are missing in the request body.' });
    }
    next();
  };
  