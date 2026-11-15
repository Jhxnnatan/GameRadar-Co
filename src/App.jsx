import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, Bell, BookOpen, Bot, Check,
  ChevronRight, CircleDollarSign, Gamepad2, Heart,
  LayoutGrid, MessageCircle, Search, Sparkles, Star,
  TrendingDown, X, Zap
} from "lucide-react";

import {
  GAMES,
  GENRES,
  PLATFORMS,
  formatCOP,
  coverGradient
} from "./data";

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function Cover({ game }) {
  return (
    <div
      className="cover"
      style={{ background: coverGradient(game.hue) }}
    >
      {game.image && (
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <span className="cover-genre">{game.genre}</span>

      <b>{game.name}</b>

      <small>GAMERADAR CO</small>
    </div>
  );
}

function GameCard({ game, favorites, toggleFavorite, openGame }) {
  return (
    <article className="game-card">
      <button
        className="cover-button"
        onClick={() => openGame(game)}
      >
        <Cover game={game} />
      </button>

      <div className="game-card-content">
        <div className="meta">
          <span>{game.genre}</span>
          <span className="score">
            <Zap size={13} />
            {game.radar}/100
          </span>
        </div>

        <h3>{game.name}</h3>

        <p className="store">
          Mejor precio en <b>{game.best.store}</b>
        </p>

        <div className="price-row">
          <strong>{formatCOP(game.cheapest)}</strong>

          {game.maxDiscount > 0 && (
            <span className="discount">
              -{game.maxDiscount}%
            </span>
          )}

          <button
            className={`heart ${
              favorites.includes(game.id) ? "active" : ""
            }`}
            onClick={() => toggleFavorite(game.id)}
          >
            <Heart
              size={17}
              fill={
                favorites.includes(game.id)
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        <button
          className="text-link"
          onClick={() => openGame(game)}
        >
          Comparar precios <ChevronRight size={15} />
        </button>
      </div>
    </article>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <span className="kicker">GAMERADAR CO / PRO</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function GameModal({ game, close, createAlert, addLibrary }) {
  if (!game) return null;

  const offers = [...game.offers].sort(
    (a, b) => a.price - b.price
  );

  return (
    <div className="backdrop" onClick={close}>
      <section
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={close}>
          <X />
        </button>

        <div className="modal-head">
          <Cover game={game} />

          <div>
            <span className="kicker">COMPARADOR DE TIENDAS</span>

            <h2>{game.name}</h2>

            <p>
              Información de demostración, no precios en vivo.
            </p>

            <strong className="modal-price">
              Desde {formatCOP(game.cheapest)}
            </strong>

            <button
              className="button primary"
              onClick={() => createAlert(game)}
            >
              <Bell size={16} /> Crear alerta
            </button>

            <button
              className="button subtle"
              onClick={() => addLibrary(game)}
            >
              <BookOpen size={16} /> Mi biblioteca
            </button>
          </div>
        </div>

        <h3>Comparación de tiendas</h3>

        {offers.map((offer, index) => (
          <div
            className={`offer ${index === 0 ? "best" : ""}`}
            key={offer.code}
          >
            <span>
              {offer.store}
              {index === 0 && <em> MEJOR PRECIO</em>}
            </span>

            <b>{formatCOP(offer.price)}</b>
          </div>
        ))}

        <div className="disclaimer">
          Los precios son datos sintéticos de demostración.
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("Inicio");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("cheap");
  const [budget, setBudget] = useState("");

  const [favorites, setFavorites] = useState(
    () => readStorage("gr-favorites", [])
  );

  const [alerts, setAlerts] = useState(
    () => readStorage("gr-alerts", [])
  );

  const [library, setLibrary] = useState(
    () => readStorage("gr-library", [])
  );

  const [reviews, setReviews] = useState(
    () => readStorage("gr-reviews", [])
  );

  const [selected, setSelected] = useState(null);
  const [alertGame, setAlertGame] = useState(null);
  const [alertTarget, setAlertTarget] = useState("");
  const [toast, setToast] = useState("");

  const [aiBudget, setAiBudget] = useState("100000");
  const [aiGenre, setAiGenre] = useState("all");

  const [reviewGame, setReviewGame] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState("5");

  useEffect(() => {
    localStorage.setItem("gr-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("gr-alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("gr-library", JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem("gr-reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  const navigation = [
    ["Inicio", LayoutGrid],
    ["Explorar", Search],
    ["Ofertas", Zap],
    ["Radar de precios", Activity],
    ["Comparador", ArrowDownUp],
    ["GameRadar AI", Bot],
    ["Comunidad", MessageCircle],
    ["Mi biblioteca", BookOpen]
  ];

  const toggleFavorite = (id) => {
    setFavorites((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  };

  const addLibrary = (game) => {
    setLibrary((old) =>
      old.includes(game.id)
        ? old.filter((id) => id !== game.id)
        : [...old, game.id]
    );

    setToast("Biblioteca actualizada");
  };

  const filteredGames = useMemo(() => {
    let games = GAMES.filter((game) => {
      const availableOffers =
        platform === "all"
          ? game.offers
          : game.offers.filter(
              (offer) => offer.code === platform
            );

      if (!availableOffers.length) return false;

      const lowestPrice = Math.min(
        ...availableOffers.map((offer) => offer.price)
      );

      if (
        !game.name.toLowerCase().includes(query.toLowerCase())
      ) return false;

      if (genre !== "all" && game.genre !== genre) {
        return false;
      }

      if (budget && lowestPrice > Number(budget)) {
        return false;
      }

      if (tab === "Ofertas" && game.maxDiscount <= 0) {
        return false;
      }

      if (
        tab === "Mi biblioteca" &&
        !library.includes(game.id)
      ) return false;

      return true;
    });

    return games.sort((a, b) => {
      if (sort === "expensive") {
        return b.cheapest - a.cheapest;
      }

      if (sort === "discount") {
        return b.maxDiscount - a.maxDiscount;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name, "es");
      }

      return a.cheapest - b.cheapest;
    });
  }, [
    query,
    platform,
    genre,
    budget,
    tab,
    library,
    sort
  ]);

  const createAlert = (game) => {
    setSelected(null);
    setAlertGame(game);
    setAlertTarget(
      String(Math.round(game.cheapest * 0.85 / 100) * 100)
    );
  };

  const saveAlert = () => {
    if (!Number(alertTarget) || Number(alertTarget) <= 0) {
      return;
    }

    setAlerts((old) => [
      {
        id: Date.now(),
        gameId: alertGame.id,
        gameName: alertGame.name,
        target: Number(alertTarget)
      },
      ...old
    ]);

    setAlertGame(null);
    setToast("Alerta guardada");
  };

  const aiResults = GAMES
    .filter((game) =>
      (aiGenre === "all" || game.genre === aiGenre) &&
      game.cheapest <= Number(aiBudget || 0)
    )
    .sort((a, b) => b.radar - a.radar)
    .slice(0, 8);

  const showGames = (title, subtitle, games) => (
    <>
      <SectionTitle title={title} subtitle={subtitle} />

      <div className="grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={setSelected}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="app">

      <header className="topbar">
        <button
          className="brand"
          onClick={() => setTab("Inicio")}
        >
          <span className="brand-icon">
            <Activity />
          </span>

          GameRadar <b>CO</b>
        </button>

        <nav>
          {navigation.map(([name, Icon]) => (
            <button
              key={name}
              className={tab === name ? "selected" : ""}
              onClick={() => {
                setTab(name);
                setQuery("");
              }}
            >
              <Icon size={15} />
              {name}
            </button>
          ))}
        </nav>

        <span className="demo-badge">
          <i /> MODO DEMO
        </span>
      </header>

      <main className="container">

        {tab === "Inicio" && (
          <>
            <section className="hero">
              <div>
                <span className="kicker">
                  RADAR GAMER COLOMBIA
                </span>

                <h1>
                  Encuentra el mejor precio.
                  <br />
                  <em>Juega sin pagar de más.</em>
                </h1>

                <p>
                  Compara videojuegos, descubre oportunidades
                  y aprovecha tu presupuesto gamer.
                </p>

                <button
                  className="button primary"
                  onClick={() => setTab("Explorar")}
                >
                  Explorar catálogo <ChevronRight size={16} />
                </button>
              </div>

              <div className="hero-radar">
                <Gamepad2 />
              </div>
            </section>

            <div className="stats">
              <div>
                <Gamepad2 />
                <b>{GAMES.length}</b>
                <span>Juegos en catálogo</span>
              </div>

              <div>
                <CircleDollarSign />
                <b>5</b>
                <span>Tiendas de demostración</span>
              </div>

              <div>
                <TrendingDown />
                <b>{GAMES.filter(g => g.maxDiscount > 0).length}</b>
                <span>Ofertas ilustrativas</span>
              </div>

              <div>
                <Heart />
                <b>{favorites.length}</b>
                <span>Favoritos</span>
              </div>
            </div>

            {showGames(
              "Juegos destacados",
              "Los juegos con mejor puntuación GameRadar.",
              [...GAMES]
                .sort((a, b) => b.radar - a.radar)
                .slice(0, 8)
            )}
          </>
        )}

        {(tab === "Explorar" ||
          tab === "Ofertas" ||
          tab === "Mi biblioteca") && (
          <section className="section">

            <SectionTitle
              title={
                tab === "Ofertas"
                  ? "Ofertas destacadas"
                  : tab === "Mi biblioteca"
                  ? "Mi biblioteca"
                  : "Explora videojuegos"
              }
              subtitle="Encuentra videojuegos y compara sus precios."
            />

            <div className="toolbar">

              <label className="search">
                <Search />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar videojuego..."
                />
              </label>

              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="all">Todas las plataformas</option>

                {Object.entries(PLATFORMS).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="all">Todos los géneros</option>

                {GENRES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="cheap">Menor precio</option>
                <option value="expensive">Mayor precio</option>
                <option value="discount">Mayor descuento</option>
                <option value="name">Nombre A-Z</option>
              </select>

              <input
                className="budget"
                type="number"
                placeholder="Presupuesto COP"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="results">
              {filteredGames.length} resultados · precios de demostración
            </div>

            {filteredGames.length ? (
              <div className="grid">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    openGame={setSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="empty">
                No hay juegos que coincidan con tus filtros.
              </div>
            )}
          </section>
        )}

        {tab === "Radar de precios" && (
          <section className="section">

            <SectionTitle
              title="Radar de precios"
              subtitle="Controla tus objetivos de compra."
            />

            <div className="feature-grid">

              <div className="panel">
                <h3><Bell /> Tus alertas</h3>

                {alerts.length ? (
                  alerts.map((alert) => (
                    <div className="list-row" key={alert.id}>
                      <span>
                        <b>{alert.gameName}</b>
                        <small>
                          Objetivo: {formatCOP(alert.target)}
                        </small>
                      </span>

                      <button
                        className="button subtle"
                        onClick={() =>
                          setAlerts(old =>
                            old.filter(a => a.id !== alert.id)
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    Todavía no tienes alertas guardadas.
                  </p>
                )}
              </div>

              <div className="panel">
                <h3><TrendingDown /> Tendencia ilustrativa</h3>

                <div className="bars">
                  {[74, 52, 67, 43, 58, 34, 48, 25, 39, 19, 28, 14].map(
                    (height, index) => (
                      <i
                        key={index}
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>

                <p className="muted">
                  Gráfico conceptual. No representa historial
                  real de precios.
                </p>
              </div>
            </div>

            <SectionTitle
              title="Crear una alerta"
              subtitle="Selecciona un juego para establecer un precio objetivo."
            />

            <div className="compact-grid">
              {GAMES.map((game) => (
                <button
                  className="pick-game"
                  key={game.id}
                  onClick={() => createAlert(game)}
                >
                  <span>{game.name}</span>
                  <b>{formatCOP(game.cheapest)}</b>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === "Comparador" && (
          <section className="section">

            <SectionTitle
              title="Comparador avanzado"
              subtitle="Compara precios entre las tiendas disponibles."
            />

            <div className="toolbar">
              <label className="search">
                <Search />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar videojuego..."
                />
              </label>
            </div>

            <div className="compare-list">
              {GAMES.filter(game =>
                game.name.toLowerCase().includes(query.toLowerCase())
              ).map((game) => (
                <button
                  className="compare-item"
                  key={game.id}
                  onClick={() => setSelected(game)}
                >
                  <span>{game.name}</span>
                  <b>{formatCOP(game.cheapest)}</b>
                  <span className="muted">
                    {game.offers.length} tiendas
                  </span>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === "GameRadar AI" && (
          <section className="section">

            <SectionTitle
              title="GameRadar AI"
              subtitle="Encuentra juegos según tu presupuesto."
            />

            <div className="ai-panel">

              <div className="ai-title">
                <span className="ai-icon">
                  <Sparkles />
                </span>

                <div>
                  <h3>Encuentra tu próximo juego</h3>
                  <p>
                    Recomendaciones según el catálogo disponible.
                  </p>
                </div>
              </div>

              <div className="toolbar">

                <label>
                  Presupuesto máximo (COP)

                  <input
                    type="number"
                    value={aiBudget}
                    onChange={(e) => setAiBudget(e.target.value)}
                  />
                </label>

                <label>
                  Género

                  <select
                    value={aiGenre}
                    onChange={(e) => setAiGenre(e.target.value)}
                  >
                    <option value="all">Cualquiera</option>

                    {GENRES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid">
                {aiResults.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    openGame={setSelected}
                  />
                ))}
              </div>

              {!aiResults.length && (
                <p className="muted">
                  No hay resultados. Prueba con otro presupuesto.
                </p>
              )}

              <p className="disclaimer">
                Este recomendador utiliza reglas y datos locales.
                Todavía no está conectado a un modelo de IA.
              </p>
            </div>
          </section>
        )}

        {tab === "Comunidad" && (
          <section className="section">

            <SectionTitle
              title="Comunidad GameRadar"
              subtitle="Comparte tus opiniones sobre videojuegos."
            />

            <div className="panel review-form">
              <h3>Publicar una reseña</h3>

              <label>
                Videojuego

                <select
                  value={reviewGame}
                  onChange={(e) => setReviewGame(e.target.value)}
                >
                  <option value="">Selecciona un juego</option>

                  {GAMES.map((game) => (
                    <option key={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Calificación

                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  {[5, 4, 3, 2, 1].map((number) => (
                    <option key={number} value={number}>
                      {number} estrellas
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tu opinión

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="¿Qué te pareció este juego?"
                />
              </label>

              <button
                className="button primary"
                disabled={!reviewGame || !reviewText.trim()}
                onClick={() => {
                  setReviews(old => [
                    {
                      id: Date.now(),
                      game: reviewGame,
                      rating: Number(reviewRating),
                      text: reviewText.trim()
                    },
                    ...old
                  ]);

                  setReviewText("");
                  setToast("Reseña guardada");
                }}
              >
                Publicar reseña
              </button>
            </div>

            <div className="reviews">
              {reviews.length ? (
                reviews.map((review) => (
                  <article className="panel" key={review.id}>
                    <div className="review-top">
                      <b>{review.game}</b>

                      <span>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>

                    <p>{review.text}</p>

                    <small>Guardada en este dispositivo</small>
                  </article>
                ))
              ) : (
                <div className="empty">
                  Todavía no hay reseñas.
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      <footer className="footer">
        <b>GameRadar <em>CO</em></b>

        <span>
          Proyecto académico · Precios de demostración.
        </span>
      </footer>

      <GameModal
        game={selected}
        close={() => setSelected(null)}
        createAlert={createAlert}
        addLibrary={addLibrary}
      />

      {alertGame && (
        <div
          className="backdrop"
          onClick={() => setAlertGame(null)}
        >
          <section
            className="modal alert-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setAlertGame(null)}
            >
              <X />
            </button>

            <span className="kicker">RADAR DE PRECIOS</span>

            <h2>{alertGame.name}</h2>

            <p>
              Define el precio objetivo en pesos colombianos.
            </p>

            <label>
              Precio máximo deseado

              <input
                type="number"
                min="1000"
                value={alertTarget}
                onChange={(e) => setAlertTarget(e.target.value)}
              />
            </label>

            <button
              className="button primary full"
              onClick={saveAlert}
            >
              Guardar alerta
            </button>

            <small>
              La alerta se guarda en este navegador.
              Las notificaciones automáticas requieren backend.
            </small>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}

    </div>
  );
}
