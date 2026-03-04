import { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

const Translator = () => {
  const [text, setText] = useState(() => localStorage.getItem("tr_text") || "");
  const [translatedText, setTranslatedText] = useState(
    () => localStorage.getItem("tr_result") || "",
  );
  const [sourceLang, setSourceLang] = useState(
    () => localStorage.getItem("tr_src") || "en",
  );
  const [targetLang, setTargetLang] = useState(
    () => localStorage.getItem("tr_tgt") || "es",
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    localStorage.setItem("tr_text", text);
    localStorage.setItem("tr_result", translatedText);
    localStorage.setItem("tr_src", sourceLang);
    localStorage.setItem("tr_tgt", targetLang);
  }, [text, translatedText, sourceLang, targetLang]);

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!text) return;
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`,
      );
      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translatedText);
    setTranslatedText(text);
  };

  const handleCopy = (t) => {
    setCopied(t);
    navigator.clipboard.writeText(t);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-col w-full gap-4">
        <form className="flex flex-col gap-6" onSubmit={handleTranslate}>
          <div className="flex items-center gap-6 glass_card p-3 bg-indigo-500/5 border-2">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="select_input !border-none !ring-0 !py-2"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={swapLanguages}
              className="icon_btn !p-2 active:rotate-180 transition-transform bg-white/50 dark:bg-black/20"
            >
              ⇄
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="select_input !border-none !ring-0 !py-2"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="glass_card flex flex-col overflow-hidden !border-2">
            <textarea
              placeholder="Type or paste text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={8}
              className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
            />
            <div className="flex items-center justify-end p-3 bg-surface/30 border-t-2 border-border">
              <button type="submit" className="btn_primary">
                Translate ↵
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
              Translating...
            </p>
          </div>
        ) : (
          translatedText && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="font-satoshi font-bold text-2xl">
                  Translated <span className="blue_gradient">Text</span>
                </h2>
                <div className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {languages.find((l) => l.code === targetLang)?.name}
                </div>
              </div>
              <div className="glass_card p-8 relative group">
                <button
                  onClick={() => handleCopy(translatedText)}
                  className="absolute top-4 right-4 icon_btn opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <img
                    src={copied === translatedText ? tick : copy}
                    alt="copy"
                    className="w-4 h-4 grayscale"
                  />
                </button>
                <p className="font-inter leading-relaxed text-sm lg:text-base opacity-95">
                  {translatedText}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Translator;
