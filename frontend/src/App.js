import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          custom_code: customCode || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.short_url);
      } else {
        alert(data.detail);
      }
    } catch (error) {
      alert("Error connecting to backend");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>URL Shortener</h2>

        <input
          style={styles.input}
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Custom code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Shorten
        </button>

        {shortUrl && (
          <div style={{ marginTop: "15px" }}>
            <p>
              Short URL:{" "}
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
            </p>

            <button style={styles.copyButton} onClick={handleCopy}>
              Copy
            </button>

            {copied && <p style={{ color: "green" }}>Copied!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  copyButton: {
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default App;