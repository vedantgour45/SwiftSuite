import { useState, useEffect } from "react";
import { copy, tick } from "../assets";

const JsonFormatter = () => {
  const [input, setInput] = useState(
    () => localStorage.getItem("jf_input") || "",
  );
  const [output, setOutput] = useState(
    () => localStorage.getItem("jf_output") || "",
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    localStorage.setItem("jf_input", input);
    localStorage.setItem("jf_output", output);
  }, [input, output]);

  const formatJson = (mode) => {
    try {
      setError("");
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      if (mode === "beautify") {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    setCopied("json");
    navigator.clipboard.writeText(output);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="w-full max-w-6xl flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-muted uppercase px-2 text-center">
            Input JSON
          </h3>
          <div className="glass_card flex flex-col overflow-hidden !border-2">
            <textarea
              placeholder='Paste JSON here... e.g. {"name": "SwiftSuite", "active": true}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={15}
              className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none font-mono"
            />
            <div className="flex items-center gap-2 p-3 bg-surface/30 border-t-2 border-border">
              <button
                onClick={() => formatJson("beautify")}
                className="btn_primary flex-1 !text-[10px]"
              >
                Beautify ↵
              </button>
              <button
                onClick={() => formatJson("minify")}
                className="btn_primary flex-1 !text-[10px] !bg-slate-700 !border-slate-700"
              >
                Minify
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError("");
                }}
                className="icon_btn !p-2"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-bold text-muted uppercase">Output</h3>
            {output && (
              <button
                onClick={handleCopy}
                className="text-[10px] font-bold text-indigo-500 uppercase hover:underline"
              >
                {copied ? "Copied!" : "Copy Output"}
              </button>
            )}
          </div>

          <div
            className={`glass_card min-h-[400px] h-full font-mono text-sm overflow-auto whitespace-pre-wrap !border-2 ${error ? "border-red-500/50 bg-red-500/5" : ""}`}
          >
            {error ? (
              <div className="text-red-500 p-5">
                <p className="font-bold">Invalid JSON:</p>
                <p className="mt-2 text-xs">{error}</p>
              </div>
            ) : output ? (
              <pre className="p-5">{output}</pre>
            ) : (
              <p className="text-muted p-5 italic">
                Format result will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JsonFormatter;
