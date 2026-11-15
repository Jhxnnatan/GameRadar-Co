import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, Bell, Bookmark, Check, ChevronDown, ChevronRight,
  CircleDollarSign, Gamepad2, Heart, Info, LayoutGrid, Search, SlidersHorizontal,
  Sparkles, Star, TrendingDown, X, Zap
} from "lucide-react";
import { GAMES, GENRES, PLATFORMS, formatCOP, coverGradient } from "./data";

const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

function GameCover({ game, large = false }) {
  const symbols = { RPG:"✦", Acción:"⚔", Roguelike:"◈", Plataformas:"▰", Simulación:"✿",
    Metroidvania:"◉", Deportes:"◎", Carreras:"⌁", Aventura:"△", Terror:"☾",
    Puzzle:"▦", Estrategia:"⬡" };
  return <div className={`game-cover ${large ? "cover-large" : ""}`} style={{background:coverGradient(game.hue)}}>
    {game.image && <img className="game-cover-image" src={game.image} alt={`Portada de ${game.name}`} loading="lazy" onError={(e)=>{e.currentTarget.style.display="none";}} />}
    <div className="cover-orbit orbit-one" /><div className="cover-orbit orbit-two" />
    <span className="cover-genre">{game.genre}</span>
    {!game.image && <><span className="cover-symbol">{symbols[game.genre] || "✦"}</span><div className="cover-title">{game.name}</div></>}
    <span className="cover-brand">GAME RADAR / CO</span>
  </div>;
}

function PriceLine({ offer, best }) {
  return <div className={`price-line ${best ? "best-line" : ""}`}>
    <span><span className="store-dot">{offer.code}</span>{offer.store}{best && <span className="best-label">MEJOR PRECIO</span>}</span>
    <strong>{formatCOP(offer.price)}</strong>
  </div>;
}

function GameCard({ game, favorite, onFavorite, onOpen }) {
  return <article className="game-card">
    <button className="cover-button" onClick={() => onOpen(game)} aria-label={`Ver ${game.name}`}>
      <GameCover game={game} />
    </button>
    <div className="game-card-body">
      <div className="card-meta"><span>{game.genre}</span><span className="radar-mini"><Zap size={12}/>{game.radar}/100</span></div>
      <h3>{game.name}</h3>
      <div className="best-store">Mejor precio en <b>{game.best.store}</b></div>
      <div className="card-price-row">
        <div><strong className="card-price">{formatCOP(game.cheapest)}</strong>
          {game.maxDiscount > 0 && <span className="discount-pill">-{game.maxDiscount}%</span>}
        </div>
        <button className={`icon-button favorite-button ${favorite ? "is-favorite" : ""}`} onClick={() => onFavorite(game.id)} aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}>
          <Heart size={17} fill={favorite ? "currentColor" : "none"}/>
        </button>
      </div>
      <button className="compare-button" onClick={() => onOpen(game)}>Comparar precios <ChevronRight size={15}/></button>
    </div>
  </article>;
}

function PriceChart({ game }) {
  const values = Array.from({length:12},(_,i)=>{
    const trend=1.18-i*.027;
    const wave=Math.sin((i+game.id)*.82)*.075;
    const variation=(((game.id*13+i*7)%9)-4)*.012;
    return Math.max(.72,trend+wave+variation);
  });
  const points = values.map((v,i)=>({x:i*30+4,y:95-v*52}));
  const change=Math.round((1-values.at(-1)/values[0])*100);
  const d = points.map((p,i)=>`${i?"L":"M"} ${p.x} ${p.y}`).join(" ");
  return <div className="chart-wrap">
    <div className="chart-heading"><div><b>Historial de precio</b><span>Últimos 12 registros · datos de demostración</span></div><span className="chart-down"><TrendingDown size={14}/> -{change}%</span></div>
    <svg viewBox="0 0 340 110" className="price-chart" role="img" aria-label="Gráfico ilustrativo de historial de precios">
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity=".3"/><stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/></linearGradient></defs>
      {[24,55,86].map(y=><line key={y} x1="0" x2="340" y1={y} y2={y} stroke="#ffffff" strokeOpacity=".08" strokeDasharray="4 5"/>)}
      <path d={`${d} L 334 110 L 4 110 Z`} fill="url(#chartFill)"/>
      <path d={d} fill="none" stroke="#a78bfa" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={points.at(-1).x} cy={points.at(-1).y} r="4" fill="#a3e635" stroke="#111827" strokeWidth="2"/>
    </svg>
    <div className="chart-labels"><span>Hace 12 registros</span><span>Actual</span></div>
  </div>;
}

function GameModal({ game, onClose, onAlert }) {
  if (!game) return null;
  const sorted = [...(game.shownOffers || game.offers)].sort((a,b)=>a.price-b.price);
  return <div className="modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget && onClose()}>
    <section className="game-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close icon-button" onClick={onClose} aria-label="Cerrar"><X size={19}/></button>
      <div className="modal-top"><GameCover game={game} large/><div className="modal-intro">
        <span className="eyebrow">{game.genre} · COMPARADOR</span><h2 id="modal-title">{game.name}</h2>
        <p>Compara las opciones disponibles en el catálogo de demostración.</p>
        <div className="modal-best-price"><span>Desde</span><strong>{formatCOP(game.cheapest)}</strong><em>en {game.best.store}</em></div>
        <button className="primary-button" onClick={()=>onAlert(game)}> <Bell size={16}/> Crear alerta de precio</button>
      </div></div>
      <div className="modal-section"><div className="section-title-row"><h3>Comparación por tienda</h3><span className="demo-tag">PRECIOS DEMO</span></div>
        <div className="price-table">{sorted.map((offer,i)=><PriceLine key={offer.code} offer={offer} best={i===0}/>)}</div>
      </div>
      <PriceChart game={game}/>
      <div className="modal-note"><Info size={15}/> Los valores son ilustrativos y no corresponden a cotizaciones en tiempo real.</div>
    </section>
  </div>;
}

function AlertModal({ game, onClose, onSave }) {
  const [target,setTarget] = useState("");
  useEffect(()=>{
    if (game) setTarget(String(Math.round(game.cheapest*.85/100)*100));
  },[game]);
  if (!game) return null;
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="small-modal" role="dialog" aria-modal="true" aria-labelledby="alert-title">
      <button className="modal-close icon-button" onClick={onClose}><X size={19}/></button>
      <div className="modal-icon"><Bell size={21}/></div><span className="eyebrow">RADAR DE PRECIOS</span>
      <h2 id="alert-title">Alerta para {game.name}</h2>
      <p>Define el precio al que te gustaría encontrar este juego.</p>
      <label className="field-label">Avisarme cuando esté por debajo de</label>
      <div className="money-input"><span>$</span><input type="number" min="1000" step="1000" value={target} onChange={e=>setTarget(e.target.value)}/><span>COP</span></div>
      <button className="primary-button full-button" disabled={!Number(target)||Number(target)<=0} onClick={()=>onSave(Number(target))}>Guardar alerta</button>
      <p className="tiny-disclaimer">Esta alerta se guarda en este navegador. No envía notificaciones automáticas.</p>
    </section>
  </div>;
}

export default function App() {
  const [tab,setTab] = useState("Explorar");
  const [query,setQuery] = useState("");
  const [platform,setPlatform] = useState("all");
  const [genre,setGenre] = useState("all");
  const [sort,setSort] = useState("cheap");
  const [maxPrice,setMaxPrice] = useState(300000);
  const [onlyDeals,setOnlyDeals] = useState(false);
  const [budget,setBudget] = useState("");
  const [showFilters,setShowFilters] = useState(false);
  const [favorites,setFavorites] = useState(()=>readStore("gr-favorites",[]));
  const [alerts,setAlerts] = useState(()=>readStore("gr-alerts",[]));
  const [recentlyViewed,setRecentlyViewed] = useState(()=>readStore("gr-history",[]));
  const [selected,setSelected] = useState(null);
  const [alertGame,setAlertGame] = useState(null);
  const [toast,setToast] = useState("");
  const [showBudget,setShowBudget] = useState(false);

  useEffect(()=>localStorage.setItem("gr-favorites",JSON.stringify(favorites)),[favorites]);
  useEffect(()=>localStorage.setItem("gr-alerts",JSON.stringify(alerts)),[alerts]);
  useEffect(()=>localStorage.setItem("gr-history",JSON.stringify(recentlyViewed)),[recentlyViewed]);
  useEffect(()=>{
    const handleShortcut=(event)=>{
      if ((event.metaKey||event.ctrlKey) && event.key.toLowerCase()==="k") {
        event.preventDefault();
        document.querySelector(".search-bar input")?.focus();
      }
      if (event.key==="Escape") { setSelected(null); setAlertGame(null); }
    };
    window.addEventListener("keydown",handleShortcut);
    return ()=>window.removeEventListener("keydown",handleShortcut);
  },[]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(""),2600);return()=>clearTimeout(id)},[toast]);

  const toggleFavorite = (id) => {
    const wasFavorite=favorites.includes(id);
    setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
    setToast(wasFavorite?"Eliminado de favoritos":"Añadido a favoritos");
  };
  const openGame = (game) => {
    setSelected(game);
    setRecentlyViewed(old=>[game.id,...old.filter(id=>id!==game.id)].slice(0,12));
  };
  const saveAlert = (target) => {
    setAlerts(old=>[{id:Date.now(),gameId:alertGame.id,gameName:alertGame.name,target,createdAt:new Date().toISOString()},...old]);
    setAlertGame(null);setToast("Alerta guardada en este dispositivo");
  };
  const filtered = useMemo(()=>{
    let list = GAMES.filter(g=>{
      const selectedOffers = platform==="all" ? g.offers : g.offers.filter(o=>o.code===platform);
      const low = Math.min(...selectedOffers.map(o=>o.price));
      return (!query || g.name.toLowerCase().includes(query.toLowerCase()))
        && (genre==="all"||g.genre===genre)
        && selectedOffers.length>0
        && low<=maxPrice
        && (!budget || low<=Number(budget))
        && (!onlyDeals || selectedOffers.some(o=>o.discount>0))
        && (tab!=="Ofertas" || selectedOffers.some(o=>o.discount>0))
        && (tab!=="Favoritos" || favorites.includes(g.id));
    }).map(g=>{
      const shownOffers=platform==="all"?g.offers:g.offers.filter(o=>o.code===platform);
      const best=[...shownOffers].sort((a,b)=>a.price-b.price)[0];
      return {...g,shownOffers,cheapest:best.price,best,maxDiscount:Math.max(...shownOffers.map(o=>o.discount))};
    });
    const low = g=>Math.min(...g.shownOffers.map(o=>o.price));
    return list.sort((a,b)=>sort==="expensive"?low(b)-low(a):sort==="discount"?b.maxDiscount-a.maxDiscount:sort==="name"?a.name.localeCompare(b.name,"es"):low(a)-low(b));
  },[query,platform,genre,maxPrice,budget,onlyDeals,tab,favorites,sort]);

  const nav = [
    {name:"Explorar",icon:LayoutGrid},{name:"Ofertas",icon:Zap},
    {name:"Favoritos",icon:Heart},{name:"Historial",icon:Activity},{name:"Acerca",icon:Info}
  ];
  const resetFilters = () => {setQuery("");setPlatform("all");setGenre("all");setMaxPrice(300000);setOnlyDeals(false);setBudget("");};
  const openAlert = (game) => {setSelected(null);setAlertGame(game);};

  return <div className="app-shell">
    <header className="topbar"><div className="topbar-inner">
      <button className="brand" onClick={()=>setTab("Explorar")}><span className="brand-mark"><Activity size={23}/><span/></span><span>GameRadar <b>CO</b></span></button>
      <nav className="desktop-nav">{nav.map(({name,icon:Icon})=><button key={name} className={tab===name?"nav-active":""} onClick={()=>setTab(name)}><Icon size={16}/>{name}{name==="Favoritos"&&favorites.length>0&&<i>{favorites.length}</i>}</button>)}</nav>
      <div className="topbar-right"><span className="demo-indicator"><span/> MODO DEMO</span><button className="mobile-menu icon-button" onClick={()=>setShowFilters(v=>!v)} aria-label="Mostrar filtros"><SlidersHorizontal/></button></div>
    </div></header>

    <main className="page-wrap">
      {tab==="Acerca" ? <section className="about-page">
        <span className="eyebrow">EL PROYECTO</span><h1>Comprar mejor también<br/><span>es parte del juego.</span></h1>
        <p className="about-lead">GameRadar CO nace para ayudar a los jugadores colombianos a comparar precios de videojuegos y tomar decisiones de compra con más información.</p>
        <div className="about-grid">
          <div className="about-card"><div className="feature-icon"><CircleDollarSign/></div><h3>Afiliados</h3><p>El proyecto podría recibir una comisión cuando una compra se realice desde un enlace de afiliado autorizado.</p></div>
          <div className="about-card"><div className="feature-icon"><Activity/></div><h3>Publicidad identificada</h3><p>Espacios promocionales claramente marcados, separados del ordenamiento objetivo por precio.</p></div>
          <div className="about-card"><div className="feature-icon"><Sparkles/></div><h3>Plan premium</h3><p>Funciones futuras como alertas avanzadas, seguimiento de precios y listas sincronizadas.</p></div>
        </div>
        <div className="notice-card"><Info/><div><b>Transparencia de datos</b><p>Esta versión académica utiliza precios sintéticos de demostración. No consulta tiendas en tiempo real ni tiene convenios comerciales activos. Para operar comercialmente se necesitarían APIs, feeds o acuerdos autorizados con cada tienda.</p></div></div>
      </section> : <>
        <section className="hero">
          <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot"/> RADAR GAMER COLOMBIA</span>
            <h1>Encuentra el mejor precio.<br/><span>Juega sin pagar de más.</span></h1>
            <p>Compara videojuegos, descubre oportunidades y haz rendir tu presupuesto gamer.</p>
            <div className="hero-pills"><span><Check size={13}/> Comparador multid tienda</span><span><Check size={13}/> Precios en COP</span></div>
          </div>
          <div className="hero-visual"><div className="radar-ring ring-a"/><div className="radar-ring ring-b"/><div className="radar-ring ring-c"/><div className="radar-sweep"/><div className="radar-center"><Gamepad2 size={42}/></div><span className="radar-point point-a"/><span className="radar-point point-b"/><span className="radar-point point-c"/></div>
          <div className="hero-glow"/>
        </section>
        <section className="stats-row">
          <div className="stat-card"><span className="stat-icon violet"><Gamepad2/></span><div><strong>{GAMES.length}</strong><span>Juegos en catálogo</span></div></div>
          <div className="stat-card"><span className="stat-icon lime"><CircleDollarSign/></span><div><strong>{Object.keys(PLATFORMS).length}</strong><span>Tiendas comparadas</span></div></div>
          <div className="stat-card"><span className="stat-icon pink"><TrendingDown/></span><div><strong>{GAMES.filter(g=>g.maxDiscount>0).length}</strong><span>Juegos con descuentos demo</span></div></div>
          <div className="stat-card"><span className="stat-icon blue"><Heart/></span><div><strong>{favorites.length}</strong><span>En tu wishlist</span></div></div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div><span className="eyebrow">{tab==="Ofertas"?"OPORTUNIDADES":"CATÁLOGO GAMER"}</span><h2>{tab==="Ofertas"?"Ofertas destacadas":tab==="Favoritos"?"Tu lista de favoritos":tab==="Historial"?"Historial de precios":"Explora videojuegos"}</h2><p>{tab==="Historial"?"Consulta una vista ilustrativa de la evolución de precios.":"Encuentra tu próximo juego al precio que buscas."}</p></div>
            <div className="heading-actions"><button className={`outline-button ${showBudget?"selected":""}`} onClick={()=>setShowBudget(v=>!v)}><CircleDollarSign size={16}/> Mi presupuesto</button><button className="outline-button filter-toggle" onClick={()=>setShowFilters(v=>!v)}><SlidersHorizontal size={16}/> Filtros <ChevronDown size={14}/></button></div>
          </div>
          <div className="search-bar"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Busca un juego, por ejemplo: Elden Ring..." aria-label="Buscar videojuego"/><kbd>⌘ K</kbd></div>
          {showBudget&&<div className="budget-panel"><div><b>Define tu presupuesto</b><span>Mostraremos juegos cuyo precio mínimo esté dentro de este valor.</span></div><div className="budget-input"><span>$</span><input type="number" min="0" placeholder="Ej. 150000" value={budget} onChange={e=>setBudget(e.target.value)}/><span>COP</span></div><button className="text-button" onClick={()=>setBudget("")}>Limpiar</button></div>}
          {showFilters&&<div className="filters-panel">
            <label>Plataforma<select value={platform} onChange={e=>setPlatform(e.target.value)}><option value="all">Todas las plataformas</option>{Object.entries(PLATFORMS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
            <label>Género<select value={genre} onChange={e=>setGenre(e.target.value)}><option value="all">Todos los géneros</option>{GENRES.map(g=><option key={g}>{g}</option>)}</select></label>
            <label>Ordenar por<select value={sort} onChange={e=>setSort(e.target.value)}><option value="cheap">Precio: menor a mayor</option><option value="expensive">Precio: mayor a menor</option><option value="discount">Mayor descuento</option><option value="name">Nombre A–Z</option></select></label>
            <label className="range-filter">Precio máximo <b>{formatCOP(maxPrice)}</b><input type="range" min="20000" max="300000" step="5000" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label>
            <label className="check-filter"><input type="checkbox" checked={onlyDeals} onChange={e=>setOnlyDeals(e.target.checked)}/> Solo ofertas</label>
            <button className="text-button" onClick={resetFilters}>Restablecer filtros</button>
          </div>}
          <div className="results-row"><span><b>{filtered.length}</b> resultados <span className="muted">· precios ilustrativos en COP</span></span><span className="sort-hint"><ArrowDownUp size={13}/> {sort==="cheap"?"Menor precio":sort==="expensive"?"Mayor precio":sort==="discount"?"Mayor descuento":"Nombre A–Z"}</span></div>
          {tab==="Historial" ? recentlyViewed.length ? <>
            <div className="history-toolbar"><span>{recentlyViewed.length} juegos vistos recientemente</span><button className="text-button" onClick={()=>setRecentlyViewed([])}>Borrar historial</button></div>
            <div className="history-grid">{recentlyViewed.map(id=>GAMES.find(game=>game.id===id)).filter(Boolean).map(game=><button className="history-card history-card-button" key={game.id} onClick={()=>openGame(game)}><GameCover game={game}/><div><b>{game.name}</b><span>Precio actual demo: {formatCOP(game.cheapest)}</span><span className="chart-down"><TrendingDown size={13}/> Ver comparación</span></div></button>)}</div>
          </> : <div className="empty-state"><div className="empty-icon"><Activity/></div><h3>Aún no tienes historial</h3><p>Cuando abras la ficha de un videojuego, aparecerá aquí para que puedas volver a consultarlo.</p><button className="outline-button" onClick={()=>setTab("Explorar")}>Explorar juegos</button></div>
          : filtered.length ? <div className="game-grid">{filtered.map(game=><GameCard key={game.id} game={game} favorite={favorites.includes(game.id)} onFavorite={toggleFavorite} onOpen={openGame}/>)}</div>
          : <div className="empty-state"><div className="empty-icon"><Search/></div><h3>No encontramos resultados</h3><p>Prueba cambiar la búsqueda o quitar algunos filtros.</p><button className="outline-button" onClick={resetFilters}>Limpiar filtros</button></div>}
        </section>
      </>}
      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark"><Activity size={19}/></span><b>GameRadar <span>CO</span></b></div><p>Un radar inteligente para la comunidad gamer colombiana.</p><div className="footer-bottom"><span>© 2026 GameRadar CO · Proyecto académico</span><span><Info size={13}/> Precios de demostración, no verificados en tiendas.</span></div></footer>
    </main>

    <div className="mobile-bottom-nav">{nav.slice(0,4).map(({name,icon:Icon})=><button key={name} className={tab===name?"nav-active":""} onClick={()=>setTab(name)}><Icon size={18}/><span>{name}</span></button>)}</div>
    <GameModal game={selected} onClose={()=>setSelected(null)} onAlert={openAlert}/>
    <AlertModal game={alertGame} onClose={()=>setAlertGame(null)} onSave={saveAlert}/>
    {tab!=="Acerca"&&alerts.length>0&&<div className="alerts-float"><Bell size={14}/>{alerts.length} alertas guardadas</div>}
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}