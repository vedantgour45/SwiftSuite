import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [summaryLength, setSummaryLength] = useState(3);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles"),
    );
    if (articlesFromLocalStorage) setAllArticles(articlesFromLocalStorage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({
      articleUrl: article.url,
      length: summaryLength,
    });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [
        newArticle,
        ...allArticles.filter((a) => a.url !== article.url),
      ];
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  const readingTime = (text) => {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form
          className="glass_card flex flex-col overflow-hidden !border-2"
          onSubmit={handleSubmit}
        >
          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="w-full p-5 text-sm outline-none bg-transparent border-none"
          />
          <div className="flex items-center justify-end p-3 bg-surface/30 border-t-2 border-border">
            <button type="submit" className="btn_primary">
              Summarize ↵
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-muted uppercase">
            Summary Length:
          </span>
          <div className="flex gap-2">
            {[1, 3, 5].map((l) => (
              <button
                key={l}
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

        <div className="flex flex-col gap-2 p-2 max-h-60 overflow-y-auto no-scrollbar">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="glass_card p-2 flex items-center gap-3 cursor-pointer"
            >
              <div
                className="icon_btn !p-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(item.url);
                }}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy"
                  className="w-3 h-3 grayscale"
                />
              </div>
              <p className="flex-1 text-xs font-medium truncate opacity-60">
                {item.url}
              </p>
            </div>
          ))}
        </div>
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
              Analyzing article contents...
            </p>
          </div>
        ) : error ? (
          <div className="glass_card p-6 text-center border-red-500/20 bg-red-500/5">
            <p className="font-bold text-red-500">Extraction failed</p>
            <p className="text-xs text-muted mt-1">
              {error?.data?.error || "Check your link and try again"}
            </p>
          </div>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <h2 className="font-satoshi font-bold text-2xl">
                  Quick <span className="blue_gradient">Digest</span>
                </h2>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted uppercase">
                      Words
                    </p>
                    <p className="text-sm font-bold">
                      {article.summary.split(" ").length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted uppercase">
                      Read Time
                    </p>
                    <p className="text-sm font-bold">
                      {readingTime(article.summary)} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass_card p-8 relative group">
                <button
                  onClick={() => handleCopy(article.summary)}
                  className="absolute top-4 right-4 icon_btn opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <img
                    src={copied === article.summary ? tick : copy}
                    alt="copy"
                    className="w-4 h-4 grayscale"
                  />
                </button>
                <p className="font-inter leading-relaxed text-sm lg:text-base opacity-90">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
