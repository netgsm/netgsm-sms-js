/**
 * Convert ESM files to .mjs format and move to dist/ directory
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const esmDir = path.join(__dirname, '../dist/esm');

// Create proper ES Module versions and copy to dist root
console.log('Processing ES Modules files...');

function fixImports(content) {
  content = content.replace(/from ['"](.*)\.js['"]/g, "from '$1.mjs'");
  content = content.replace(/from ["'](\.[^"']*?)["']/g, (match, p1) => {
    if (p1.endsWith('.mjs') || p1.endsWith('.js') || p1.endsWith('.json')) return match;
    return `from "${p1}.mjs"`;
  });
  return content;
}

function processDir(srcDir, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  entries.forEach(entry => {
    if (entry.isDirectory()) {
      processDir(path.join(srcDir, entry.name), path.join(outDir, entry.name));
    } else if (entry.name.endsWith('.js')) {
      const content = fixImports(fs.readFileSync(path.join(srcDir, entry.name), 'utf8'));
      const outFile = path.join(outDir, entry.name.replace('.js', '.mjs'));
      fs.writeFileSync(outFile, content);
      const rel = path.relative(distDir, outFile);
      console.log(`Converted and moved: ${entry.name} -> ${rel}`);
    }
  });
}

processDir(esmDir, distDir);

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