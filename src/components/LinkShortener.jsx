import { useState, useEffect } from "react";
import { loader, copy, linkIcon, tick } from "../assets";
import { QRCodeSVG } from "qrcode.react";

const LinkShortener = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const localHistory = JSON.parse(localStorage.getItem("link_history"));
    if (localHistory) setHistory(localHistory);
  }, []);

  const handleShortening = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", url);

      const response = await fetch(
        "https://url-shortener-service.p.rapidapi.com/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_ARTICLE_KEY,
            "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
          },
          body: encodedParams,
        },
      );

      const data = await response.json();
      if (data?.result_url) {
        setShortenedUrl(data.result_url);
        const newHistory = [
          { original: url, short: data.result_url },
          ...history,
        ].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("link_history", JSON.stringify(newHistory));
      } else {
        setError("Unable to shorten URL");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    setCopied(text);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form
          className="glass_card flex flex-col overflow-hidden !border-2"
          onSubmit={handleShortening}
        >
          <input
            type="url"
            placeholder="Paste your long URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full p-5 text-sm outline-none bg-transparent border-none"
          />
          <div className="flex items-center justify-end p-3 bg-surface/30 border-t-2 border-border">
            <button type="submit" className="btn_primary">
              Shorten ↵
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-1">
          {history.map((item, i) => (
            <div
              key={i}
              onClick={() => setShortenedUrl(item.short)}
              className="glass_card p-3 flex items-center gap-3 cursor-pointer opacity-60 hover:opacity-100"
            >
              <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded">
                HISTORY
              </span>
              <p className="flex-1 text-xs truncate">{item.original}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 w-full flex flex-col items-center">
        {isLoading ? (
          <img src={loader} alt="loader" className="w-16 h-16 object-contain" />
        ) : error ? (
          <div className="glass_card p-6 text-center border-red-500/20">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : (
          shortenedUrl && (
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="glass_card p-6 flex flex-col items-center justify-center gap-4 bg-white/5">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG value={shortenedUrl} size={150} />
                </div>
                <p className="text-[10px] font-bold text-muted uppercase">
                  Scan for Mobile
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <h2 className="font-satoshi font-bold text-2xl">
                  Shortened <span className="blue_gradient">Link</span>
                </h2>
                <div className="glass_card p-6 flex items-center justify-between gap-4">
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline font-medium truncate"
                  >
                    {shortenedUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(shortenedUrl)}
                    className="icon_btn"
                  >
                    <img
                      src={copied === shortenedUrl ? tick : copy}
                      alt="copy"
                      className="w-4 h-4 grayscale"
                    />
                  </button>
                </div>
                <p className="text-sm text-muted">
                  Your link is ready! You can also use the QR code to quickly
                  share it with mobile users.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default LinkShortener;
