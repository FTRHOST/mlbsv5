const fs = require('fs');
const path = './src/pages/Inmatch/index.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/json\?\.data\?\.Battle/g, 'json?.battle');
content = content.replace(/json\?\.data\?\.blueTeamName/g, 'json?.blue_team_name');
content = content.replace(/json\?\.data\?\.redTeamName/g, 'json?.red_team_name');
content = content.replace(/json\?\.data\?\.blueScore/g, 'json?.blue_score');
content = content.replace(/json\?\.data\?\.redScore/g, 'json?.red_score');
content = content.replace(/json\?\.data\?\.baseOf/g, 'json?.base_of');

fs.writeFileSync(path, content);
console.log('Replacements done!');
