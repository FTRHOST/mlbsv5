const fs = require('fs');

const files = [
  'src/imports/DraftPick-1/index.tsx',
  'src/imports/DraftPickLoading/index.tsx',
  'src/imports/Inmatch/index.tsx',
  'src/imports/DraftPickLoading-1/index.tsx',
  'src/imports/Inmatch-2/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add import statement at the beginning
  if (!content.includes('import { appConfig }')) {
    content = `import { appConfig } from "@/config";\n` + content;
  }

  // Replace operatorId usages
  const regex1 = /"test\/OperatorId\/2218712873\/iPlayer"/g;
  content = content.replace(regex1, '`test/OperatorId/${appConfig.operatorId}/iPlayer`');

  const regex2 = /'test\/OperatorId\/2218712873\/iPlayer'/g;
  content = content.replace(regex2, '`test/OperatorId/${appConfig.operatorId}/iPlayer`');

  fs.writeFileSync(file, content);
});

console.log("Configuration updated!");
