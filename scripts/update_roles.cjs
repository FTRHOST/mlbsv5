const fs = require('fs');

const files = [
  'src/imports/DraftPickLoading/index.tsx',
  'src/imports/DraftPickLoading-1/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  for (let i = 0; i < 5; i++) {
    const fnName = i === 0 ? 'Wraper' : `Wraper${i}`;
    const ipos = i + 1;

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*return \\(\\s*<div className="col-1 grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">\\s*<div className="bg-\\[#292929\\] col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[167px\\]" data-name="bg" />\\s*<div className="col-1 ml-\\[43px\\] mt-\\[41px\\] relative row-1 size-\\[80px\\]" data-name="role">\\s*<img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src=\\{imgLogo\\} />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.ipos === ${ipos});
  const role = player?.role;
  const imageSrc = role && role > 0 ? \`/assets/lane/\${role}.png\` : imgLogo;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  fs.writeFileSync(file, content);
});
console.log("Done");
