import { useState, useMemo, useEffect } from "react";

const WordCounter = () => {
  const [text, setText] = useState(() => localStorage.getItem("wc_text") || "");

  useEffect(() => {
    localStorage.setItem("wc_text", text);
  }, [text]);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed)
      return {
        words: 0,
        chars: 0,
        sentences: 0,
        paragraphs: 0,
        readTime: 0,
        grade: 0,
      };

    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
    const charCount = text.length;
    const sentenceCount = trimmed
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const paragraphCount = trimmed
      .split(/\n+/)
      .filter((p) => p.trim().length > 0).length;
    const readTime = Math.ceil(words.length / 200);

    // Simple Flesch-Kincaid Grade level estimation
    // Grade = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    // Roughly approximated:
    const grade = Math.min(
      12,
      Math.max(1, Math.round(0.39 * (words.length / (sentenceCount || 1)) + 5)),
    );

    return {
      words: words.length,
      chars: charCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      readTime,
      grade,
    };
  }, [text]);

  const topWords = useMemo(() => {
    const words = text.toLowerCase().match(/\b(\w+)\b/g);
    if (!words) return [];

    const freq = {};
    words.forEach((w) => {
      if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [text]);

  return (
    <section className="w-full max-w-6xl flex flex-col gap-10">
      <div className="glass_card flex flex-col overflow-hidden !border-2">
        <textarea
          placeholder="Type or paste text to see real-time statistics..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
        />
        <div className="flex items-center justify-end p-3 bg-surface/30 border-t-2 border-border">
          <button
            type="button"
            onClick={() => setText("")}
            className="text-[10px] font-bold text-muted uppercase hover:text-red-500 transition-colors px-2"
          >
            Clear Text
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Words", val: stats.words, icon: "📝" },
          { label: "Characters", val: stats.chars, icon: "🔤" },
          { label: "Sentences", val: stats.sentences, icon: "⚡" },
          { label: "Paragraphs", val: stats.paragraphs, icon: "📑" },
        ].map((s, i) => (
          <div key={i} className="glass_card p-5 flex flex-col items-center">
            <span className="text-2xl mb-2">{s.icon}</span>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-[10px] font-bold text-muted uppercase mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass_card p-6">
          <h3 className="text-sm font-bold text-muted uppercase mb-4">
            Readability & Time
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">Reading Time</span>
              <span className="font-bold text-indigo-500">
                {stats.readTime} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">Readability Grade</span>
              <span className="font-bold text-amber-500">
                Level {stats.grade}
              </span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${(stats.grade / 12) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass_card p-6">
          <h3 className="text-sm font-bold text-muted uppercase mb-4">
            Top Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {topWords.length > 0 ? (
              topWords.map(([word, count], i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20"
                >
                  <span className="text-xs font-bold text-indigo-400">
                    {word}
                  </span>
                  <span className="text-[10px] font-black opacity-50">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted italic">
                Type more text to see keywords...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordCounter;
