import { useState } from "react";
import { account, ID } from "../lib/appwrite";

export default function AuthPanel({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
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

    try {
      if (mode === "register") {
        await account.create({
          userId: ID.unique(),
          email,
          password,
          name
        });

        await account.createEmailPasswordSession({
          email,
          password
        });

        setMessage("¡Cuenta creada correctamente!");
      } else {
        await account.createEmailPasswordSession({
          email,
          password
        });
      }

      const user = await account.get();

      if (onLogin) onLogin(user);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-backdrop">
      <section className="auth-card">

        <button
          className="auth-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <h2>
          {mode === "login"
            ? "Bienvenido a GameRadar CO"
            : "Crear una cuenta"}
        </h2>

        <p>Accede a tus favoritos y alertas de precios.</p>

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          {message && (
            <p className="auth-success">{message}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Procesando..."
              : mode === "login"
                ? "Iniciar sesión"
                : "Registrarme"}
          </button>

        </form>

        <div className="auth-switch">
          {mode === "login"
            ? "¿No tienes cuenta?"
            : "¿Ya tienes una cuenta?"}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
              setMessage("");
            }}
          >
            {mode === "login" ? "Registrarme" : "Iniciar sesión"}
          </button>
        </div>

      </section>
    </div>
  );
}
