// utils/erdGenerator.js
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const analyzeRequirements = (requirements) => {
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

    return { entities, relationships };
};

const generateMermaidDefinition = (entities, relationships) => {
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

    return mermaidDefinition;
};

const generateErdImage = async (mermaidDefinition) => {
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
    await page.waitForSelector('#mermaid-container svg', { timeout: 5000 });
    const timestamp = Date.now();
    const imageName = `erd_${timestamp}.png`;
    const imagePath = path.join(__dirname, '../generated_erds', imageName);
    await fs.mkdir(path.join(__dirname, '../generated_erds'), { recursive: true });
    await page.screenshot({ path: imagePath, fullPage: true });
    await browser.close();
    return imagePath;
};

module.exports = { analyzeRequirements, generateMermaidDefinition, generateErdImage };