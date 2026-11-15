const P = {
  S: ["Steam", 0.92], E: ["Epic Games", 0.95], P: ["PlayStation Store", 1.05],
  X: ["Xbox Store", 1.02], N: ["Nintendo eShop", 1.10]
};

const STEAM_APP_IDS = {
  "Elden Ring":1245620, "The Witcher 3":292030, "Hades":1145360,
  "Celeste":504230, "Stardew Valley":413150, "Hollow Knight":367520,
  "EA Sports FC 25":2669320, "Forza Horizon 5":1551360, "God of War":1593500,
  "Cyberpunk 2077":1091500, "Red Dead Redemption 2":1174180,
  "Resident Evil 4":2050650, "Hogwarts Legacy":990080, "Cuphead":268910,
  "Terraria":105600, "Rocket League":252950, "Portal 2":620,
  "Civilization VI":289070, "Dark Souls III":374320,
  "Spider-Man Remastered":1817070, "Baldur’s Gate 3":1086940,
  "Sekiro":814380, "Death Stranding":1190460, "Sea of Thieves":1172620,
  "Disco Elysium":632470, "Dead Cells":588650,
  "Ori and the Will of the Wisps":1057090, "Slay the Spire":646570,
  "Phasmophobia":739630, "NBA 2K25":2878980, "Among Us":945360
};

const EXTRA_COVERS = {
  "Minecraft": "https://minecraft.wiki/images/Minecraft_cover.png",
  "Zelda: Breath of the Wild": "https://upload.wikimedia.org/wikipedia/en/0/0a/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
  "Mario Kart 8 Deluxe": "https://upload.wikimedia.org/wikipedia/en/b/b6/Mario_Kart_8_Deluxe_cover.jpg",
  "Fortnite Pack Inicial": "https://cdn2.unrealengine.com/fortnite-og-social-1920x1080-1920x1080-6f9a7c7a7b6a.jpg",
  "Gran Turismo 7": "https://upload.wikimedia.org/wikipedia/en/2/2a/Gran_Turismo_7_cover_art.jpg"
};

const G = [
  ["Elden Ring","RPG",220,"SPXE"],["The Witcher 3","RPG",90,"SPXN"],
  ["Hades","Roguelike",95,"SEPXN"],["Celeste","Plataformas",60,"SPXN"],
  ["Stardew Valley","Simulación",55,"SPXN"],["Hollow Knight","Metroidvania",65,"SPXN"],
  ["EA Sports FC 25","Deportes",260,"SPX"],["Forza Horizon 5","Carreras",240,"SX"],
  ["God of War","Acción",200,"SP"],["Minecraft","Aventura",110,"PXN"],
  ["Cyberpunk 2077","RPG",180,"SPXE"],["Red Dead Redemption 2","Acción",190,"SEPX"],
  ["Resident Evil 4","Terror",210,"SPX"],["Hogwarts Legacy","RPG",230,"SPXN"],
  ["Cuphead","Plataformas",75,"SPXN"],["Terraria","Aventura",35,"SPXN"],
  ["Rocket League","Deportes",60,"EPXN"],["Portal 2","Puzzle",40,"S"],
  ["Civilization VI","Estrategia",150,"SEPXN"],["Dark Souls III","RPG",170,"SPX"],
  ["Zelda: Breath of the Wild","Aventura",250,"N"],["Mario Kart 8 Deluxe","Carreras",250,"N"],
  ["Spider-Man Remastered","Acción",200,"SP"],["Fortnite Pack Inicial","Acción",50,"EPXN"],
  ["Baldur’s Gate 3","RPG",230,"SPX"],["Sekiro","Acción",190,"SPX"],
  ["Death Stranding","Aventura",160,"SPE"],["Sea of Thieves","Aventura",120,"SX"],
  ["Disco Elysium","RPG",90,"SPXN"],["Dead Cells","Roguelike",70,"SPXEN"],
  ["Ori and the Will of the Wisps","Plataformas",85,"SXN"],["Slay the Spire","Estrategia",65,"SPXN"],
  ["Phasmophobia","Terror",50,"S"],["Gran Turismo 7","Carreras",230,"P"],
  ["NBA 2K25","Deportes",250,"SPX"],["Among Us","Puzzle",15,"SEPXN"]
];

export const PLATFORMS = Object.fromEntries(Object.entries(P).map(([key,[name]]) => [key,name]));
export const GENRES = [...new Set(G.map((g) => g[1]))].sort((a,b)=>a.localeCompare(b,"es"));

export const GAMES = G.map(([name, genre, base, platforms], index) => {
  const offers = [...platforms].map((code, k) => {
    const factor = P[code][1];
    const old = Math.round(base * 1000 * factor * (1 + ((index * 7 + k * 3) % 5) * .02) / 100) * 100;
    const sale = (index * 5 + k * 3) % 7 === 0;
    const discount = sale ? 20 + ((index + k) % 4) * 10 : 0;
    const price = Math.round(old * (1 - discount / 100) / 100) * 100;
    return { code, store: P[code][0], old, price, discount };
  });
  const cheapest = Math.min(...offers.map((o) => o.price));
  const best = offers.find((o) => o.price === cheapest);
  const maxDiscount = Math.max(...offers.map((o) => o.discount));
  const radar = Math.min(98, Math.max(42, Math.round(48 + maxDiscount * .9 + (offers.length - 1) * 4)));
  const steamId = STEAM_APP_IDS[name];
  const image = steamId ? `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg` : (EXTRA_COVERS[name] || null);
  return { id:index, name, genre, offers, cheapest, best, maxDiscount, radar, hue:(index * 47) % 360, image };
});

export const formatCOP = (value) => new Intl.NumberFormat("es-CO", {
  style:"currency", currency:"COP", maximumFractionDigits:0
}).format(value);

export function coverGradient(hue) {
  return `linear-gradient(145deg, hsl(${hue} 76% 42%), hsl(${(hue+58)%360} 64% 13%))`;
}