const fs = require('fs');
const path = './src/imports/DraftPick-1/index.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change Context to store the whole data object
content = content.replace(
  'const DraftContext = createContext<any[]>([]);',
  'const DraftContext = createContext<any>({});'
);

// Update usePlayerName hook
content = content.replace(
  /function usePlayerName\(ipos: number\) \{\n  const players = useContext\(DraftContext\);\n  const player = players\.find\(p => p\.ipos === ipos\);\n  return player \? player\.name : "NAMA";\n\}/,
  `function usePlayerName(ipos: number) {
  const data = useContext(DraftContext);
  const player = (data?.players || []).find((p: any) => p.ipos === ipos);
  return player ? player.name : "NAMA";
}`
);

// Update DraftPick to store the whole data object
content = content.replace(
  /const \[players, setPlayers\] = useState<any\[\]>\(\[\]\);/,
  `const [apiData, setApiData] = useState<any>({});`
);

content = content.replace(
  /if \(data && data\.data && data\.data\.players\) \{\n          setPlayers\(data\.data\.players\);\n        \}/,
  `if (data && data.data) {
          setApiData(data.data);
        }`
);

content = content.replace(
  /<DraftContext\.Provider value=\{players\}>/,
  `<DraftContext.Provider value={apiData}>`
);

// Update BlueTeamContainer
content = content.replace(
  /function BlueTeamContainer\(\) \{/,
  `function BlueTeamContainer() {
  const data = useContext(DraftContext);
  const teamName = data?.blueTeamName || "BLUE TEAM";`
);
content = content.replace(
  />BLUE TEAM<\/p>/,
  `>{teamName}</p>`
);

// Update RedTeamContainer
content = content.replace(
  /function RedTeamContainer\(\) \{/,
  `function RedTeamContainer() {
  const data = useContext(DraftContext);
  const teamName = data?.redTeamName || "RED TEAM";`
);
content = content.replace(
  />RED TEAM<\/p>/,
  `>{teamName}</p>`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Team names updated successfully.");
