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

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*const data = useContext\\(DraftLoadingContext\\);\\s*const player = data\\?\\.players\\?\\.find\\(\\(p: any\\) => p\\.team === 1 && p\\.role === ${roleIndex}\\);\\s*const heroId = player\\?\\.SelHeroID;\\s*const imageSrc = heroId \\? \\\`/assets/heroes-sa/\\\$\\{heroId\\}\\.webp\\\` : imgHero;\\s*return \\(\\s*<div className="grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid place-items-start relative shrink-0" data-name="Hero Image">\\s*<div className="col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[438px\\]" data-name="hero">\\s*<div className="absolute inset-0 overflow-hidden pointer-events-none">\\s*<img alt="" className="absolute h-\\[138\\.41%\\] left-\\[0\\.05%\\] max-w-none top-\\[-0\\.14%\\] w-full" src=\\{imageSrc\\} />\\s*</div>\\s*</div>\\s*<div className="col-1 ml-\\[14px\\] mt-\\[100px\\] relative row-1 size-\\[64px\\]" data-name="spell">\\s*<img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src=\\{imgSpell\\} width="64" />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === ${roleIndex});
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? \`/assets/heroes-sa/\${heroId}.webp\` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? \`/assets/spells/\${spellId}.webp\` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
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

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*const data = useContext\\(DraftLoadingContext\\);\\s*const player = data\\?\\.players\\?\\.find\\(\\(p: any\\) => p\\.team === 2 && p\\.role === ${roleIndex}\\);\\s*const heroId = player\\?\\.SelHeroID;\\s*const imageSrc = heroId \\? \\\`/assets/heroes-sa/\\\$\\{heroId\\}\\.webp\\\` : imgHero;\\s*return \\(\\s*<div className="grid-cols-\\[max-content\\] grid-rows-\\[max-content\\] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">\\s*<div className="col-1 h-\\[178px\\] ml-0 mt-0 relative row-1 w-\\[438px\\]" data-name="Avatar Image">\\s*<div className="absolute inset-0 overflow-hidden pointer-events-none">\\s*<img alt="" className="absolute h-\\[138\\.41%\\] left-\\[0\\.05%\\] max-w-none top-\\[-0\\.14%\\] w-full" src=\\{imageSrc\\} />\\s*</div>\\s*</div>\\s*<div className="col-1 ml-\\[365px\\] mt-\\[100px\\] relative row-1 size-\\[64px\\]">\\s*<img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src=\\{imgSpell\\} width="64" />\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === ${roleIndex});
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? \`/assets/heroes-sa/\${heroId}.webp\` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? \`/assets/spells/\${spellId}.webp\` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  // Update TextContainers 0-9
  for (let i = 0; i < 10; i++) {
    const fnName = i === 0 ? 'TextContainer' : `TextContainer${i}`;
    const roleIndex = Math.floor(i / 2) + 1; // 1, 1, 2, 2, 3, 3, 4, 4, 5, 5
    const teamIndex = (i % 2 === 0) ? 1 : 2; // 1 for Blue, 2 for Red

    const regex = new RegExp(`function ${fnName}\\(\\) \\{\\s*const data = useContext\\(DraftLoadingContext\\);\\s*const player = data\\?\\.players\\?\\.find\\(\\(p: any\\) => p\\.team === ${teamIndex} && p\\.role === ${roleIndex}\\);\\s*const playerName = player\\?\\.name \\|\\| "NAMA";\\s*return \\(\\s*<div className="\\[word-break:break-word\\] col-1 content-stretch flex flex-col gap-\\[40px\\] h-\\[178px\\] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-\\[438px\\] whitespace-nowrap" data-name="Text Container">\\s*<div className="flex flex-col font-\\['Inter:Semi_Bold',sans-serif\\] font-semibold justify-center relative shrink-0 text-\\[32px\\]">\\s*<p className="indent-\\[15px\\] leading-\\[0px\\]">\\{playerName\\}</p>\\s*</div>\\s*<div className="flex flex-col font-\\['Inter:Medium',sans-serif\\] font-medium justify-center relative shrink-0 text-\\[24px\\]">\\s*<p className="indent-\\[15px\\] leading-\\[0px\\] mb-0">HEROO NAME</p>\\s*<p className="indent-\\[15px\\] leading-\\[0px\\]">​</p>\\s*</div>\\s*</div>\\s*\\);\\s*\\}`, 'g');

    const replacement = `function ${fnName}() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === ${teamIndex} && p.role === ${roleIndex});
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}`;
    content = content.replace(regex, replacement);
  }

  // Update DraftPickLoading to fetch heroes.json
  const dpRegex = new RegExp(`export default function DraftPickLoading\\(\\) \\{\\s*const \\[apiData, setApiData\\] = useState<any>\\(\\{\\}\\);\\s*useEffect\\(\\(\\) => \\{\\s*const firebaseConfig = \\{\\s*apiKey: "AIzaSyB-Px-qoQVca854NjTUA-BEa-ms0lKLgpg",\\s*authDomain: "api-mlbs\\.firebaseapp\\.com",\\s*databaseURL: "https://api-mlbs-default-rtdb\\.firebaseio\\.com",\\s*projectId: "api-mlbs",\\s*storageBucket: "api-mlbs\\.firebasestorage\\.app",\\s*messagingSenderId: "52167304217",\\s*appId: "1:52167304217:web:f9bb95be9dbbcdcf96b688",\\s*measurementId: "G-H4SXHJ8Y1P",\\s*\\};\\s*const app = initializeApp\\(firebaseConfig\\);\\s*const db = getDatabase\\(app\\);\\s*const dataRef = ref\\(db, "test/OperatorId/2218712873/iPlayer"\\);\\s*const unsubscribe = onValue\\(dataRef, \\(snapshot\\) => \\{\\s*const data = snapshot\\.val\\(\\);\\s*if \\(data\\) \\{\\s*setApiData\\(data\\);\\s*\\}\\s*\\}\\);\\s*return \\(\\) => unsubscribe\\(\\);\\s*\\}, \\[\\]\\);\\s*return \\(\\s*<DraftLoadingContext\\.Provider value=\\{apiData\\}>`, 'g');

  const dpReplacement = `export default function DraftPickLoading() {
  const [apiData, setApiData] = useState<any>({});
  const [heroesData, setHeroesData] = useState<any>({});

  useEffect(() => {
    fetch('/assets/heroes.json')
      .then(res => res.json())
      .then(data => setHeroesData(data))
      .catch(err => console.error(err));

    const firebaseConfig = {
      apiKey: "AIzaSyB-Px-qoQVca854NjTUA-BEa-ms0lKLgpg",
      authDomain: "api-mlbs.firebaseapp.com",
      databaseURL: "https://api-mlbs-default-rtdb.firebaseio.com",
      projectId: "api-mlbs",
      storageBucket: "api-mlbs.firebasestorage.app",
      messagingSenderId: "52167304217",
      appId: "1:52167304217:web:f9bb95be9dbbcdcf96b688",
      measurementId: "G-H4SXHJ8Y1P",
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const dataRef = ref(db, "test/OperatorId/2218712873/iPlayer");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setApiData(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DraftLoadingContext.Provider value={{ ...apiData, heroesData }}>`;

  content = content.replace(dpRegex, dpReplacement);

  fs.writeFileSync(file, content);
});
console.log("Done");
