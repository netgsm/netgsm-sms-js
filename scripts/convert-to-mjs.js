/**
 * Convert ESM files to .mjs format
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

// Read all JavaScript files in the dist directory
const jsFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));

console.log(`Converting ${jsFiles.length} files to .mjs format...`);

// Copy each .js file to an .mjs file
jsFiles.forEach(file => {
  const jsPath = path.join(distDir, file);
  const mjsPath = path.join(distDir, file.replace('.js', '.mjs'));
  
  // Read content from .js file
  let content = fs.readFileSync(jsPath, 'utf8');
  
  // Fix imports if necessary (change .js to .mjs)
  content = content.replace(/from ['"](.*)\.js['"]/g, "from '$1.mjs'");
  
  // Ensure exports.__esModule is set to true for correct default export
  if (file === 'index.js') {
    // Check if the file already has Object.defineProperty for __esModule
    if (!content.includes('Object.defineProperty(exports, "__esModule"')) {
      content = content.replace(
        'exports.default = void 0;', 
        'exports.default = void 0;\nObject.defineProperty(exports, "__esModule", { value: true });'
      );
    }
    
    // Make sure default export is properly set
    // This handles both cases: class as default export and object as default export
    if (content.includes('exports.default = ')) {
      console.log('Default export found in index.js');
    } else {
      console.warn('Warning: No default export found in index.js');
    }
  }
  
  // Write to .mjs file
  fs.writeFileSync(mjsPath, content);
  
  console.log(`Converted: ${file} -> ${file.replace('.js', '.mjs')}`);
});

// Check if index.mjs exists and has proper exports
const indexMjsPath = path.join(distDir, 'index.mjs');
if (fs.existsSync(indexMjsPath)) {
  console.log('Verifying index.mjs file...');
  const indexContent = fs.readFileSync(indexMjsPath, 'utf8');
  
  // Log for debugging
  console.log('Default export in index.mjs: ' + 
    (indexContent.includes('export default') || indexContent.includes('exports.default =')));
}

console.log('Conversion completed successfully!'); 