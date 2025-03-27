/**
 * Convert ESM files to .mjs format
 */
const fs = require('fs');
const path = require('path');

const esmDir = path.join(__dirname, '../dist');

// Read all JavaScript files in the esm directory
const jsFiles = fs.readdirSync(esmDir).filter(file => file.endsWith('.js'));

console.log(`Converting ${jsFiles.length} files to .mjs format...`);

// Copy each .js file to an .mjs file
jsFiles.forEach(file => {
  const jsPath = path.join(esmDir, file);
  const mjsPath = path.join(esmDir, file.replace('.js', '.mjs'));
  
  // Read content from .js file
  const content = fs.readFileSync(jsPath, 'utf8');
  
  // Fix imports if necessary (change .js to .mjs)
  const updatedContent = content.replace(/from ['"](.*)\.js['"]/g, "from '$1.mjs'");
  
  // Write to .mjs file
  fs.writeFileSync(mjsPath, updatedContent);
  
  console.log(`Converted: ${file} -> ${file.replace('.js', '.mjs')}`);
});

console.log('Conversion completed successfully!'); 