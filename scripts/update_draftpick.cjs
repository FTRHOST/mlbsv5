const fs = require('fs');
const path = './src/imports/DraftPick-1/index.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add Context imports
content = content.replace(
  'import { motion } from "motion/react";',
  'import { motion } from "motion/react";\nimport { createContext, useContext, useEffect, useState } from "react";\n\nconst DraftContext = createContext<any[]>([]);\n\nfunction usePlayerName(ipos: number) {\n  const players = useContext(DraftContext);\n  const player = players.find(p => p.ipos === ipos);\n  return player ? player.name : "NAMA";\n}'
);

// Update PlayerCardsBlue to pass ipos
content = content.replace(
  /function PlayerCardsBlue\(\) \{[\s\S]*?<\/div>\n  \);\n\}/,
  `function PlayerCardsBlue() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full" data-name="Player Cards Blue">
      <PlayerCard01AfterOnPicked ipos={1} />
      <PlayerCard ipos={2} />
      <PlayerCard1 ipos={3} />
      <PlayerCard2 ipos={4} />
      <PlayerCard3 ipos={5} />
    </div>
  );
}`
);

// Update PlayerCardsBlue1 to pass ipos (10 to 6)
content = content.replace(
  /function PlayerCardsBlue1\(\) \{[\s\S]*?<\/div>\n  \);\n\}/,
  `function PlayerCardsBlue1() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full" data-name="Player Cards Blue">
      <PlayerCard7 ipos={10} />
      <PlayerCard6 ipos={9} />
      <PlayerCard5 ipos={8} />
      <PlayerCard4 ipos={7} />
      <PlayerCard06HasPicked ipos={6} />
    </div>
  );
}`
);

// Update all PlayerCard functions to accept ipos and use usePlayerName
const cards = ['PlayerCard01AfterOnPicked', 'PlayerCard', 'PlayerCard1', 'PlayerCard2', 'PlayerCard3', 'PlayerCard7', 'PlayerCard6', 'PlayerCard5', 'PlayerCard4', 'PlayerCard06HasPicked'];

cards.forEach(card => {
  const regex = new RegExp(`function ${card}\\(\\) \\{`);
  content = content.replace(regex, `function ${card}({ ipos }: { ipos: number }) {\n  const playerName = usePlayerName(ipos);`);
});

// Now replace NAMA with {playerName} inside the card functions
content = content.replace(/>NAMA<\/p>/g, '>{playerName}</p>');

// Also there is CoachInfo which has NAMA. Do we change it? The user only specified "function PlayerCard".
// We will only do replacement inside PlayerCard. But >NAMA</p> might affect CoachInfo too.
// If it affects CoachInfo, it's probably harmless if we don't pass ipos?
// Wait, CoachInfo doesn't have {playerName} in scope! So it will fail to compile.
// Let's fix that. We should restore >NAMA</p> for CoachInfo.
// Or we just modify CoachInfo as well. Let's just fix it for CoachInfo so it doesn't break, or revert it.
// Actually, I can use a more precise regex:
content = content.replace(/function CoachInfo\(\) \{[\s\S]*?<\/div>\n  \);\n\}/, match => match.replace(/>\{playerName\}<\/p>/g, '>NAMA</p>'));
content = content.replace(/function CoachInfo1\(\) \{[\s\S]*?<\/div>\n  \);\n\}/, match => match.replace(/>\{playerName\}<\/p>/g, '>NAMA</p>'));

// Update DraftPick to fetch and provide context
content = content.replace(
  /export default function DraftPick\(\) \{/,
  `export default function DraftPick() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://mlbsv4.vercel.app/api/rooms/332108113')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.players) {
          setPlayers(data.data.players);
        }
      })
      .catch(err => console.error(err));
  }, []);
`
);

content = content.replace(
  /return \(\n    <div className="bg-\[#e63030\] relative size-full" data-name="DraftPick">/,
  `return (
    <DraftContext.Provider value={players}>
      <div className="bg-[#e63030] relative size-full" data-name="DraftPick">`
);

content = content.replace(
  /<ScoreboardSection \/>\n    <\/div>\n  \);\n\}/,
  `<ScoreboardSection />
      </div>
    </DraftContext.Provider>
  );
}`
);

fs.writeFileSync(path, content, 'utf8');
console.log("File updated successfully.");
