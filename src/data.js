const P = {
  S: ["Steam", 0.92], E: ["Epic Games", 0.95], P: ["PlayStation Store", 1.05],
  X: ["Xbox Store", 1.02], N: ["Nintendo eShop", 1.10]
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
  return { id:index, name, genre, offers, cheapest, best, maxDiscount, radar, hue:(index * 47) % 360 };
});

export const formatCOP = (value) => new Intl.NumberFormat("es-CO", {
  style:"currency", currency:"COP", maximumFractionDigits:0
}).format(value);

export function coverGradient(hue) {
  return `linear-gradient(145deg, hsl(${hue} 76% 42%), hsl(${(hue+58)%360} 64% 13%))`;
}