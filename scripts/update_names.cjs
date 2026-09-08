const fs = require('fs');

const files = [
  'src/imports/DraftPickLoading/index.tsx',
  'src/imports/DraftPickLoading-1/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Update TextContainers 0-9
  for (let i = 0; i < 10; i++) {
    const fnName = i === 0 ? 'TextContainer' : `TextContainer${i}`;
    const roleIndex = Math.floor(i / 2) + 1; // 1, 1, 2, 2, 3, 3, 4, 4, 5, 5
    const teamIndex = (i % 2 === 0) ? 1 : 2; // 1 for Blue, 2 for Red

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*return \\(\\s*<div className="\\[word-break:break-word\\] col-1 content-stretch flex flex-col gap-\\[40px\\] h-\\[178px\\] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-\\[438px\\] whitespace-nowrap" data-name="Text Container">\\s*<div className="flex flex-col font-\\['Inter:Semi_Bold',sans-serif\\] font-semibold justify-center relative shrink-0 text-\\[32px\\]">\\s*<p className="indent-\\[15px\\] leading-\\[0px\\]">NAMA</p>\\s*</div>\\s*<div className="flex flex-col font-\\['Inter:Medium',sans-serif\\] font-medium justify-center relative shrink-0 text-\\[24px\\]">\\s*<p className="indent-\\[15px\\] leading-\\[0px\\] mb-0">HEROO NAME</p>\\s*<p className="indent-\\[15px\\] leading-\\[0px\\]">​</p>\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === ${teamIndex} && p.role === ${roleIndex});
  const playerName = player?.name || "NAMA";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">HEROO NAME</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  // Update Wrapers 0-4
  for (let i = 0; i < 5; i++) {
    const fnName = i === 0 ? 'Wraper' : `Wraper${i}`;
    const roleIndex = i + 1;
    // We already modified Wraper to have context, so we have to match the NEW version of Wraper
    
    // We'll replace it entirely to just use the static role icon if they want it ordered by role,
    // or we can keep it dynamic based on the actual player. The user said:
    // "urutkan berdasaarkan role dari atas ke bawah" so row i corresponds to role = i+1.
    // The previous Wraper logic found player by ipos, let's fix it to use role instead!
    
    const wRegex = new RegExp(`function ${fnName}\\(\\) \\{\\s*const data = useContext\\(DraftLoadingContext\\);\\s*const player = data\\?\\.players\\?\\.find\\(\\(p: any\\) => p\\.ipos === \\d+\\);\\s*const role = player\\?\\.role;\\s*const imageSrc = role && role > 0 \\? \\\`/assets/lane/\\\$\\{role\\}\\.png\\\` : imgLogo;\\s*return \\(\\s*<div className="col-1 grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">\\s*<div className="bg-\\[#292929\\] col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[167px\\]" data-name="bg" />\\s*<div className="col-1 ml-\\[43px\\] mt-\\[41px\\] relative row-1 size-\\[80px\\]" data-name="role">\\s*<img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src=\\{imageSrc\\} />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');
    
    const wReplacement = `function ${fnName}() {
  const imageSrc = \`/assets/lane/${roleIndex}.png\`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}`;
    content = content.replace(wRegex, wReplacement);
  }

  fs.writeFileSync(file, content);
});
console.log("Done");
