import { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";

const GrammarChecker = () => {
  const [text, setText] = useState(() => localStorage.getItem("gc_text") || "");
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("gc_results");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    localStorage.setItem("gc_text", text);
    localStorage.setItem("gc_results", JSON.stringify(results));
  }, [text, results]);

  const checkGrammar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ text, language: "en-US" }),
      });
      const data = await response.json();
      setResults(data.matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied("text");
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form className="flex flex-col gap-4" onSubmit={checkGrammar}>
          <div className="glass_card flex flex-col overflow-hidden !border-2">
            <textarea
              placeholder="Paste text to check for grammar, spelling, and style errors..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={10}
              className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
            />
            <div className="flex items-center justify-end p-4 bg-surface/30 border-t-2 border-border">
              <button type="submit" className="btn_primary">
                Check Grammar ↵
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="my-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={loader}
              alt="loading"
              className="w-16 h-16 object-contain"
            />
            <p className="text-sm font-bold text-indigo-500 animate-pulse">
              Scanning for errors...
            </p>
          </div>
        ) : results && results.length === 0 ? (
          <div className="glass_card p-8 border-emerald-500/20 bg-emerald-500/5 text-center">
            <p className="text-emerald-500 font-bold text-lg">
              ✨ No errors found!
            </p>
            <p className="text-sm text-muted mt-1">Your text looks great.</p>
          </div>
        ) : (
          results && (
            <div className="flex flex-col gap-6">
              <h2 className="font-satoshi font-bold text-2xl">
                Found{" "}
                <span className="blue_gradient">
                  {results.length} Improvements
                </span>
              </h2>
              <div className="flex flex-col gap-4">
                {results.map((match, i) => (
                  <div
                    key={i}
                    className="glass_card p-5 group hover:border-indigo-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            match.rule.issueType === "spelling"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {match.rule.issueType || "Grammar"}
                        </span>
                        <p className="mt-3 text-sm font-medium opacity-80 italic">
                          "
                          {match.context.text.substring(
                            match.context.offset,
                            match.context.offset + match.context.length,
                          )}
                          "
                        </p>
                        <p className="mt-1 text-base font-bold">
                          {match.message}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-[200px] justify-end">
                        {match.replacements.slice(0, 3).map((rep, j) => (
                          <button
                            key={j}
                            onClick={() => {
                              const newText =
                                text.substring(0, match.offset) +
                                rep.value +
                                text.substring(match.offset + match.length);
                              setText(newText);
                              setResults(null);
                            }}
                            className="px-2 py-1 text-[10px] bg-indigo-500 text-white rounded font-bold hover:bg-indigo-600"
                          >
                            {rep.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default GrammarChecker;
