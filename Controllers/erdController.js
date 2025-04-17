const { generateERDImage } = require('../utils/erdGenerator');

// Controller to handle ERD generation
exports.generateERD = async (req, res) => {
  const { requirements } = req.body;

  try {
    const imagePath = await generateERDImage(requirements);
    res.json({ message: `ERD diagram generated successfully and saved at: ${imagePath}` });
  } catch (error) {
    console.error('Error generating ERD:', error);
    res.status(500).json({ error: 'Failed to generate ERD diagram.' });
  }
};
