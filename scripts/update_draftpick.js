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

// Now replace NAMA with {playerName} inside the card functions, but only inside <p> NAMA </p>
// We can just globally replace >NAMA< with >{playerName}< inside those components,
// or we can do a targeted replace for the exact strings:
content = content.replace(/>NAMA<\/p>/g, '>{playerName}</p>');

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
