import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const previewCode = useMemo(() => customCode.trim() || "auto", [customCode]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCopied(false);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Enter a destination URL to shorten.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Use a complete URL, including https:// or http://.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
          custom_code: customCode.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.short_url);
      } else {
        setError(data.detail || "Could not create that short link.");
      }
    } catch {
      setError("Could not connect to the backend at 127.0.0.1:8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="app-shell" data-theme={theme}>
      <section className="shortener-panel" aria-labelledby="page-title">
        <div className="brand-row">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img" focusable="false">
                <path
                  d="M18.5 30.5 15 34a6.4 6.4 0 0 1-9-9l6.5-6.5a6.4 6.4 0 0 1 9 0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
                <path
                  d="M29.5 17.5 33 14a6.4 6.4 0 0 1 9 9l-6.5 6.5a6.4 6.4 0 0 1-9 0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
                <path
                  d="M19 29 29 19"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div>
              <h1 id="page-title">URL Shortener</h1>
            </div>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>

        <form className="shortener-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Destination URL</span>
            <input
              type="url"
              placeholder="https://example.com/very/long/link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>

          <label className="field-group">
            <span>Custom code</span>
            <div className="code-input">
              <span>{API_URL.replace("http://", "")}/</span>
              <input
                placeholder="launch"
                value={customCode}
                onChange={(event) => setCustomCode(event.target.value)}
              />
            </div>
          </label>

          {error && <p className="status-message error">{error}</p>}

          <button className="primary-button" disabled={isLoading} type="submit">
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        <div className="link-preview" aria-label="Short link preview">
          <span>Preview</span>
          <strong>{API_URL.replace("http://", "")}/{previewCode}</strong>
        </div>

        {shortUrl && (
          <section className="result-panel" aria-live="polite">
            <div>
              <span>Your short link</span>
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
            </div>
            <button className="secondary-button" onClick={handleCopy} type="button">
              {copied ? "Copied" : "Copy"}
            </button>
          </section>
        )}
      </section>
      <p className="credits">Made by Phaneendra Peravarapu</p>
    </main>
  );
}

export default App;
