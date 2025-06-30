const fs = require('fs');
const path = require('path');

const sourceDir = '.'; // change as needed
const targetDir = '../dist'; // change as needed

function ensureDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${dirPath}`);
    }
  } else {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyHtmlFiles(src, dest) {
  const items = fs.readdirSync(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      // Only recurse if the directory contains .html files
      const hasHtml = fs.readdirSync(srcPath).some((f) => f.endsWith('.html'));
      if (hasHtml) {
        ensureDir(destPath);
        copyHtmlFiles(srcPath, destPath);
      }
    } else if (item.isFile() && item.name.endsWith('.html')) {
      ensureDir(dest); // ensure dest exists before copying
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copySpecificFolder(srcFolder, destFolder) {
  if (!fs.existsSync(srcFolder)) return;

  ensureDir(destFolder);

  const files = fs.readdirSync(srcFolder, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(srcFolder, file.name);
    const destPath = path.join(destFolder, file.name);

    if (file.isDirectory()) {
      copySpecificFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// only copy .html files from sourceDir
copyHtmlFiles(sourceDir, targetDir);

// only copy these two specific folders
copySpecificFolder(
  path.join(sourceDir, 'assets/js'),
  path.join(targetDir, 'assets/js'),
);
copySpecificFolder(
  path.join(sourceDir, 'assets/file'),
  path.join(targetDir, 'assets/file'),
);
