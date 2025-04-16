<<<<<<< HEAD
// "body-parser": "^2.2.0",
//     "cors": "^2.8.5",
//     "express": "^5.1.0",
//     "mermaid": "^11.6.0",
//     "multer": "^1.4.5-lts.2",
//     "puppeteer": "^24.6.0",
//     "sharp": "^0.34.0"

const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 5000; // You can choose a different port

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to receive user requirements and generate ERD
app.post('/generate-erd', async (req, res) => {
    const { requirements } = req.body;

    if (!requirements) {
        return res.status(400).json({ error: 'Requirements are missing in the request body.' });
    }

    try {
        // Dynamically import mermaid
        const mermaid = await import('mermaid');
        await mermaid.default.initialize({ startOnLoad: false }); // Initialize manually

        // 1. Basic Analysis of Requirements (Very Simple and Rule-Based)
        const entities = [];
        const relationships = [];

        const entitiesMatch = requirements.match(/Entities:\s*(.*?)\n/);
        if (entitiesMatch && entitiesMatch[1]) {
            const entityDefinitions = entitiesMatch[1].split(',').map(e => e.trim());
            entityDefinitions.forEach(def => {
                const parts = def.match(/(\w+)\s*\((.*?)\)/);
                if (parts) {
                    entities.push({ name: parts[1], attributes: parts[2].split(',').map(a => a.trim()) });
                }
            });
        }

        const relationshipsMatch = requirements.match(/Relationships:\s*(.*?)\n/);
        if (relationshipsMatch && relationshipsMatch[1]) {
            const relationshipDefinitions = relationshipsMatch[1].split(',').map(r => r.trim());
            relationshipDefinitions.forEach(def => {
                const parts = def.match(/(\w+)\s+has\s+(one|many)\s+(\w+)\s*\((.*?)\)/);
                if (parts) {
                    relationships.push({
                        source: parts[1],
                        type: parts[2],
                        target: parts[3],
                        details: parts[4].split(',').map(d => d.trim())
                    });
                }
            });
        }

        // 2. Generate Mermaid ERD Diagram Definition
        let mermaidDefinition = `erDiagram\n`;
        entities.forEach(entity => {
            mermaidDefinition += `  ${entity.name} {\n`;
            entity.attributes.forEach(attr => {
                mermaidDefinition += `    ${attr}\n`;
            });
            mermaidDefinition += `  }\n`;
        });

        relationships.forEach(rel => {
            let relationshipString = `  ${rel.source} `;
            if (rel.type === 'one') {
                relationshipString += `--o{ `;
            } else if (rel.type === 'many') {
                relationshipString += `--o{ `; // Assuming 'has many' implies at least one
            }
            relationshipString += `${rel.target} : ${rel.details.join(', ')}\n`;
            mermaidDefinition += relationshipString;
        });

        // 3. Generate ERD Image using Mermaid and Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <script type="module">
              import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
              mermaid.initialize({ startOnLoad: true });
            </script>
          </head>
          <body>
            <div id="mermaid-container" class="mermaid">
              ${mermaidDefinition}
            </div>
          </body>
          </html>
        `);

        // Wait for the mermaid diagram to render (you might need to adjust the timeout)
        await page.waitForSelector('#mermaid-container svg', { timeout: 5000 });

        const svgContent = await page.$eval('#mermaid-container svg', el => el.outerHTML);
        const timestamp = Date.now();
        const imageName = `erd_${timestamp}.png`;
        const imagePath = path.join(__dirname, 'generated_erds', imageName);
        await fs.mkdir(path.join(__dirname, 'generated_erds'), { recursive: true });
        await page.screenshot({ path: imagePath, fullPage: true });

        await browser.close();

        res.json({ message: `ERD diagram generated successfully and saved at: ${imagePath}` });

    } catch (error) {
        console.error('Error generating ERD:', error);
        res.status(500).json({ error: 'Failed to generate ERD diagram.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
=======
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const erdRoutes = require('./routes/erdRoutes');
const path = require('path');

const app = express();
const port = 5000; // You can choose a different port

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the ERD routes
app.use('/', erdRoutes);

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
>>>>>>> 57a5f10 (ERD backend updated with structured folders)
