const fs = require('fs');

const files = [
  'src/imports/DraftPickLoading/index.tsx',
  'src/imports/DraftPickLoading-1/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Update HeroImages 0-4 (Blue Team)
  for (let i = 0; i < 5; i++) {
    const fnName = i === 0 ? 'HeroImage' : `HeroImage${i}`;
    const roleIndex = i + 1;

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*return \\(\\s*<div className="grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid place-items-start relative shrink-0" data-name="Hero Image">\\s*<div className="col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[438px\\]" data-name="hero">\\s*<div className="absolute inset-0 overflow-hidden pointer-events-none">\\s*<img alt="" className="absolute h-\\[138\\.41%\\] left-\\[0\\.05%\\] max-w-none top-\\[-0\\.14%\\] w-full" src=\\{imgHero\\} />\\s*</div>\\s*</div>\\s*<div className="col-1 ml-\\[14px\\] mt-\\[100px\\] relative row-1 size-\\[64px\\]" data-name="spell">\\s*<img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src=\\{imgSpell\\} width="64" />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === ${roleIndex});
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? \`/assets/heroes-sa/\${heroId}.webp\` : imgHero;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={imgSpell} width="64" />
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  // Update AvatarContainers 0-4 (Red Team)
  for (let i = 0; i < 5; i++) {
    const fnName = i === 0 ? 'AvatarContainer' : `AvatarContainer${i}`;
    const roleIndex = i + 1;

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*return \\(\\s*<div className="grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">\\s*<div className="col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[438px\\]" data-name="Avatar Image">\\s*<div className="absolute inset-0 overflow-hidden pointer-events-none">\\s*<img alt="" className="absolute h-\\[138\\.41%\\] left-\\[0\\.05%\\] max-w-none top-\\[-0\\.14%\\] w-full" src=\\{imgHero\\} />\\s*</div>\\s*</div>\\s*<div className="col-1 ml-\\[365px\\] mt-\\[100px\\] relative row-1 size-\\[64px\\]">\\s*<img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src=\\{imgSpell\\} width="64" />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === ${roleIndex});
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? \`/assets/heroes-sa/\${heroId}.webp\` : imgHero;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={imgSpell} width="64" />
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  fs.writeFileSync(file, content);
});
console.log("Done");
