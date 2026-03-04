import { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";
import { useLazyGetTextSummaryQuery } from "../services/article";

const TextSummarizer = () => {
  const [text, setText] = useState(() => localStorage.getItem("ts_text") || "");
  const [summary, setSummary] = useState(
    () => localStorage.getItem("ts_summary") || "",
  );
  const [copied, setCopied] = useState("");
  const [summaryLength, setSummaryLength] = useState(
    () => Number(localStorage.getItem("ts_length")) || 3,
  );

  useEffect(() => {
    localStorage.setItem("ts_text", text);
    localStorage.setItem("ts_summary", summary);
    localStorage.setItem("ts_length", summaryLength);
  }, [text, summary, summaryLength]);

  const [getTextSummary, { error, isFetching }] = useLazyGetTextSummaryQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getTextSummary({ text, length: summaryLength });
    if (data?.summary) setSummary(data.summary);
  };

  const handleCopy = (copyText) => {
    setCopied(copyText);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="glass_card flex flex-col overflow-hidden !border-2">
            <textarea
              placeholder="Paste your long text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={10}
              className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
            />
            <div className="flex items-center justify-between p-4 bg-surface/30 border-t-2 border-border">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest px-2">
                {text.length} characters
              </span>
              <button type="submit" className="btn_primary">
                Summarize ↵
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-muted uppercase">
              Length:
            </span>
            <div className="flex gap-2">
              {[1, 3, 5].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSummaryLength(l)}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-all border-2 ${
                    summaryLength === l
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-border text-muted hover:border-indigo-500"
                  }`}
                >
                  {l === 1 ? "Brief" : l === 3 ? "Standard" : "Detailed"}
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
              Generating summary...
            </p>
          </div>
        ) : error ? (
          <div className="glass_card p-6 text-center border-red-500/20">
            <p className="font-bold text-red-500">Could not summarize text</p>
            <p className="text-xs text-muted mt-1">
              Please try with a shorter text or check back later.
            </p>
          </div>
        ) : (
          summary && (
            <div className="flex flex-col gap-6">
              <h2 className="font-satoshi font-bold text-2xl">
                Content <span className="blue_gradient">Brief</span>
              </h2>
              <div className="glass_card p-8 relative group">
                <button
                  onClick={() => handleCopy(summary)}
                  className="absolute top-4 right-4 icon_btn opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <img
                    src={copied === summary ? tick : copy}
                    alt="copy"
                    className="w-4 h-4 grayscale"
                  />
                </button>
                <p className="font-inter leading-relaxed text-sm lg:text-base opacity-90">
                  {summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default TextSummarizer;
