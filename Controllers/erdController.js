// controllers/erdController.js
const { analyzeRequirements, generateMermaidDefinition, generateErdImage } = require('../utils/erdGenerator');

const generateErd = async (req, res) => {
    const { requirements } = req.body;

    try {
        const { entities, relationships } = analyzeRequirements(requirements);
        const mermaidDefinition = generateMermaidDefinition(entities, relationships);
        const imagePath = await generateErdImage(mermaidDefinition);

        res.json({ message: `ERD diagram generated successfully and saved at: ${imagePath}` });

    } catch (error) {
        console.error('Error generating ERD:', error);
        res.status(500).json({ error: 'Failed to generate ERD diagram.' });
    }
};

module.exports = { generateErd };