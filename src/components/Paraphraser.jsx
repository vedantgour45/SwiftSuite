import { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";
import { useLazyGetParaphraseQuery } from "../services/article";

const Paraphraser = () => {
  const [text, setText] = useState(() => localStorage.getItem("pp_text") || "");
  const [paraphrase, setParaphrase] = useState(
    () => localStorage.getItem("pp_result") || "",
  );
  const [tone, setTone] = useState(
    () => localStorage.getItem("pp_tone") || "standard",
  );
  const [copied, setCopied] = useState("");

  useEffect(() => {
    localStorage.setItem("pp_text", text);
    localStorage.setItem("pp_result", paraphrase);
    localStorage.setItem("pp_tone", tone);
  }, [text, paraphrase, tone]);

  const [getParaphrase, { error, isFetching }] = useLazyGetParaphraseQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getParaphrase({ text, tone });
    if (data?.rewritten) setParaphrase(data.rewritten);
  };

  const tones = ["standard", "formal", "casual", "creative"];

  const handleCopy = (t) => {
    setCopied(t);
    navigator.clipboard.writeText(t);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="glass_card flex flex-col overflow-hidden !border-2">
            <textarea
              placeholder="Paste text to rephrase or rewrite in a different tone..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={10}
              className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
            />
            <div className="flex items-center justify-end p-4 bg-surface/30 border-t-2 border-border">
              <button type="submit" className="btn_primary">
                Paraphrase ↵
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-muted uppercase">
              Tone selection:
            </span>
            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-all border-2 ${
                    tone === t
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-border text-muted hover:border-indigo-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="my-10 w-full">
        {isFetching ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={loader}
              alt="loading"
              className="w-16 h-16 object-contain"
            />
            <p className="text-sm font-bold text-indigo-500 animate-pulse">
              Rewriting text...
            </p>
          </div>
        ) : error ? (
          <div className="glass_card p-6 text-center border-red-500/20">
            <p className="font-bold text-red-500">Operation failed</p>
            <p className="text-xs text-muted mt-1">
              Try again with a shorter snippet.
            </p>
          </div>
        ) : (
          paraphrase && (
            <div className="flex flex-col gap-6">
              <h2 className="font-satoshi font-bold text-2xl">
                Refined <span className="blue_gradient">Content</span>
              </h2>
              <div className="glass_card p-8 relative group">
                <button
                  onClick={() => handleCopy(paraphrase)}
                  className="absolute top-4 right-4 icon_btn opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <img
                    src={copied === paraphrase ? tick : copy}
                    alt="copy"
                    className="w-4 h-4 grayscale"
                  />
                </button>
                <p className="font-inter leading-relaxed text-sm lg:text-base opacity-95">
                  {paraphrase}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Paraphraser;
