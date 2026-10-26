import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import "./App.css";

const emptyItem = { title: "", description: "", status: "Pending" };

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...emptyItem });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleError(err) {
    setError(err.message);
    if (err.status === 401) {
      setToken("");
      setItems([]);
      setForm({ ...emptyItem });
      setEditingId(null);
    }
  }

  useEffect(() => {
    if (!token) return;

    let active = true;
    setLoading(true);

    apiRequest("items/", { token })
      .then((result) => {
        if (active) setItems(result);
      })
      .catch((err) => {
        if (active) handleError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function authenticate(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      if (registerMode) {
        await apiRequest("auth/register/", {
          method: "POST",
          data: { username, password },
        });
        setRegisterMode(false);
        setPassword("");
        setMessage("Account created. Please log in.");
      } else {
        const result = await apiRequest("auth/login/", {
          method: "POST",
          data: { username, password },
        });
        setPassword("");
        setToken(result.token);
        setMessage(`Welcome, ${result.user.username}.`);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function saveItem(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const saved = await apiRequest(
        editingId ? `items/${editingId}/` : "items/",
        {
          method: editingId ? "PATCH" : "POST",
          data: form,
          token,
        }
      );

      setItems((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? saved : item))
          : [saved, ...current]
      );
      setMessage(editingId ? "Item updated." : "Item created.");
      setForm({ ...emptyItem });
      setEditingId(null);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    setError("");
    setMessage("");
  }

  async function deleteItem(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await apiRequest(`items/${item.id}/`, {
        method: "DELETE",
        token,
      });
      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (editingId === item.id) {
        setEditingId(null);
        setForm({ ...emptyItem });
      }

      setMessage("Item deleted.");
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await apiRequest("auth/logout/", { method: "POST", token });
      setToken("");
      setItems([]);
      setForm({ ...emptyItem });
      setEditingId(null);
      setMessage("Logged out successfully.");
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>WorkFlowHub</h1>
          <p>Organise your work and track your progress.</p>
        </div>
        {token && (
          <button onClick={logout} disabled={busy || loading}>
            Log out
          </button>
        )}
      </header>

      {error && <p role="alert" className="error">{error}</p>}
      {message && <p role="status" className="message">{message}</p>}

      {!token ? (
        <section className="auth-panel">
          <h2>{registerMode ? "Create an account" : "Log in"}</h2>

          <form onSubmit={authenticate}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              maxLength={150}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={registerMode ? "new-password" : "current-password"}
              required
            />

            <button type="submit" disabled={busy}>
              {busy ? "Please wait..." : registerMode ? "Register" : "Log in"}
            </button>
          </form>

          <button
            className="secondary"
            disabled={busy}
            onClick={() => {
              setRegisterMode(!registerMode);
              setPassword("");
              setError("");
              setMessage("");
            }}
          >
            {registerMode ? "Already registered? Log in" : "Create an account"}
          </button>
        </section>
      ) : (
        <div className="workspace">
          <section className="editor">
            <h2>{editingId ? "Edit workflow item" : "New workflow item"}</h2>

            <form onSubmit={saveItem}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                maxLength={200}
                required
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                required
                rows={4}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />

              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button type="submit" disabled={busy || loading}>
                {busy ? "Please wait..." : editingId ? "Save changes" : "Create item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary"
                  disabled={busy}
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyItem });
                  }}
                >
                  Cancel editing
                </button>
              )}
            </form>
          </section>

          <section className="item-list">
            <h2>My workflow items</h2>

            {loading ? (
              <p>Loading items...</p>
            ) : items.length === 0 ? (
              <p>No items yet. Create your first workflow item.</p>
            ) : (
              items.map((item) => (
                <article className="workflow-item" key={item.id}>
                  <span className="status">{item.status}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="item-actions">
                    <button disabled={busy} onClick={() => editItem(item)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      disabled={busy}
                      onClick={() => deleteItem(item)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </main>
  );
}