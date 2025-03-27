/**
 * Convert ESM files to .mjs format and move to dist/ directory
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const esmDir = path.join(__dirname, '../dist/esm');

// Create proper ES Module versions and copy to dist root
console.log('Processing ES Modules files...');

// Process all JS files in the esm directory
const esmFiles = fs.readdirSync(esmDir).filter(file => file.endsWith('.js'));

esmFiles.forEach(file => {
  const esmFilePath = path.join(esmDir, file);
  const mjsFilePath = path.join(distDir, file.replace('.js', '.mjs'));
  
  // Read the ESM JS file
  let content = fs.readFileSync(esmFilePath, 'utf8');
  
  // Fix imports to use .mjs extension
  // 1. Fix imports with .js extension
  content = content.replace(/from ['"](.*)\.js['"]/g, "from '$1.mjs'");
  
  // 2. Fix imports without extension (e.g., "./enums" -> "./enums.mjs")
  content = content.replace(/from ["'](\.[^"']*?)["']/g, (match, p1) => {
    // Skip if it already has an extension
    if (p1.endsWith('.mjs') || p1.endsWith('.js') || p1.endsWith('.json')) {
      return match;
    }
    return `from "${p1}.mjs"`;
  });
  
  // Write to .mjs file in dist root
  fs.writeFileSync(mjsFilePath, content);
  
  console.log(`Converted and moved: ${file} -> ${file.replace('.js', '.mjs')}`);
});

// Verify index.mjs
const indexMjsPath = path.join(distDir, 'index.mjs');
if (fs.existsSync(indexMjsPath)) {
  console.log('Verifying index.mjs file...');
  const indexContent = fs.readFileSync(indexMjsPath, 'utf8');
  
  // Check for default export
  const hasDefaultExport = 
    indexContent.includes('export default') || 
    indexContent.includes('export { default }');
  
  console.log(`Default export in index.mjs: ${hasDefaultExport ? 'Found' : 'NOT FOUND!'}`);
  
  // If no default export found, we add one manually
  if (!hasDefaultExport) {
    console.log('Adding default export to index.mjs...');
    
    // Find the Netgsm class export
    if (indexContent.includes('export class Netgsm')) {
      const updatedContent = indexContent.replace(
        'export class Netgsm', 
        'export class Netgsm'
      ) + '\nexport default Netgsm;\n';
      
      fs.writeFileSync(indexMjsPath, updatedContent);
      console.log('Default export added successfully.');
    } else {
      console.warn('Warning: Could not locate Netgsm class to export as default');
    }
  }
}

console.log('ES Modules conversion completed successfully!'); 