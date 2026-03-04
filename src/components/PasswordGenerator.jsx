import { useState, useCallback, useEffect } from "react";
import { copy, tick } from "../assets";

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    numbers: true,
    symbols: true,
    uppercase: true,
  });
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generated);

    // Calc strength
    let score = 0;
    if (length > 12) score += 1;
    if (length > 20) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;
    if (options.uppercase) score += 1;
    setStrength(score);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(password);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col items-center">
      <div className="glass_card p-10 w-full flex flex-col gap-10">
        <div className="flex items-center justify-between gap-6 p-6 border-2 border-indigo-500/30 rounded-2xl bg-indigo-500/5 shadow-inner">
          <p className="font-mono text-2xl lg:text-3xl font-black break-all text-indigo-600 dark:text-indigo-400">
            {password}
          </p>
          <div className="flex gap-4">
            <button
              onClick={generatePassword}
              className="icon_btn text-2xl !p-3"
              title="Regenerate"
            >
              🔄
            </button>
            <button onClick={handleCopy} className="icon_btn !p-3">
              <img
                src={copied ? tick : copy}
                alt="copy"
                className="w-6 h-6 grayscale"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted uppercase">
              Strength:{" "}
              {strength < 2 ? "Weak" : strength < 4 ? "Good" : "Strong"}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all ${i <= strength ? (strength < 3 ? "bg-red-500" : strength < 5 ? "bg-amber-500" : "bg-emerald-500") : "bg-border"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Length: {length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {Object.keys(options).map((key) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() =>
                    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="w-5 h-5 rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold capitalize group-hover:text-indigo-500 transition-colors">
                  {key}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordGenerator;
