import { useState } from "react";
import { account, ID } from "../lib/appwrite";

export default function AuthPanel({
  onClose,
  onLogin,
  initialMode = "login"
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === "register") {
        if (password.length < 8) {
          throw new Error(
            "La contraseña debe tener mínimo 8 caracteres."
          );
        }

        await account.create({
          userId: ID.unique(),
          email: cleanEmail,
          password,
          name: name.trim()
        });

        await account.createEmailPasswordSession({
          email: cleanEmail,
          password
        });
      } else {
        await account.createEmailPasswordSession({
          email: cleanEmail,
          password
        });
      }

      const user = await account.get();

      if (onLogin) {
        onLogin(user);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err?.message ||
          "Ocurrió un error al autenticar la cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  const changeMode = () => {
    setMode((current) =>
      current === "login" ? "register" : "login"
    );

    setError("");
    setMessage("");
  };

  return (
    <div
      className="auth-backdrop"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <section className="auth-card">
        <button
          className="auth-close"
          onClick={onClose}
          type="button"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="auth-logo">
          GAMERADAR <b>CO</b>
        </div>

        <h2>
          {mode === "login"
            ? "Bienvenido a GameRadar CO"
            : "Crear una cuenta"}
        </h2>

        <p>
          Accede a tus favoritos y alertas de precios.
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            autoComplete={
              mode === "register"
                ? "new-password"
                : "current-password"
            }
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-success">
              {message}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {mode === "login"
              ? "¿No tienes cuenta?"
              : "¿Ya tienes una cuenta?"}
          </span>

          <button
            type="button"
            onClick={changeMode}
          >
            {mode === "login"
              ? "Registrarme"
              : "Iniciar sesión"}
          </button>
        </div>
      </section>
    </div>
  );
}
