const fs = require('node:fs');
const path = require('node:path');

const projectRoot = __dirname;
const outputDirectory = path.join(projectRoot, 'dist');

fs.mkdirSync(outputDirectory, { recursive: true });

for (const entry of ['index.html', 'css', 'js']) {
  const sourcePath = path.join(projectRoot, entry);
  const destinationPath = path.join(outputDirectory, entry);
  const sourceStats = fs.statSync(sourcePath);

  if (sourceStats.isDirectory()) {
    fs.cpSync(sourcePath, destinationPath, { recursive: true });
  } else {
    fs.copyFileSync(sourcePath, destinationPath);
  }
}

console.log('CREOVATE static site prepared in dist/.');
