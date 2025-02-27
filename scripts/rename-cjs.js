const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../dist/cjs');

fs.readdirSync(dir).forEach((file) => {
  if (path.extname(file) === '.js') {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, file.replace('.js', '.cjs'));
    fs.renameSync(oldPath, newPath);
  }
});
