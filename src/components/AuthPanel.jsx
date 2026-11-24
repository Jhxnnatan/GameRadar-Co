```jsx
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

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === "register") {
        if (password.length < 8) {
          throw new Error(
            "La contraseña debe tener mínimo 8 caracteres."
          );
        }

        if (!name.trim()) {
          throw new Error("Ingresa tu nombre.");
        }

        // Crear la cuenta en Appwrite
        await account.create({
          userId: ID.unique(),
          email: cleanEmail,
          password,
          name: name.trim(),
        });

        // Crear sesión automáticamente
        await account.createEmailPasswordSession({
          email: cleanEmail,
          password,
        });
      } else {
        // Iniciar sesión
        await account.createEmailPasswordSession({
          email: cleanEmail,
          password,
        });
      }

      // Recuperar usuario autenticado
      const user = await account.get();

      setMessage("Autenticación exitosa.");

      if (onLogin) {
        onLogin(user);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error de autenticación Appwrite:", err);

      setError(
        err?.message ||
        "No fue posible completar la operación. Intenta nuevamente."
      );
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
              mode === "login"
                ? "current-password"
                : "new-password"
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
            type="submit"
            disabled={loading}
          >
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
            disabled={loading}
            onClick={() => {
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              );
              setError("");
              setMessage("");
            }}
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
```
