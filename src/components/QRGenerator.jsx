import { useState, useEffect } from "react";
import { copy, tick } from "../assets";
import { QRCodeCanvas } from "qrcode.react";

const QRGenerator = () => {
  const [text, setText] = useState(() => localStorage.getItem("qr_text") || "");
  const [qrColor, setQrColor] = useState(
    () => localStorage.getItem("qr_color") || "#000000",
  );
  const [bgColor, setBgColor] = useState(
    () => localStorage.getItem("qr_bg_color") || "#ffffff",
  );
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("qr_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [downloadState, setDownloadState] = useState("idle"); // idle, processing, success

  useEffect(() => {
    localStorage.setItem("qr_text", text);
    localStorage.setItem("qr_color", qrColor);
    localStorage.setItem("qr_bg_color", bgColor);
    localStorage.setItem("qr_history", JSON.stringify(history));
  }, [text, qrColor, bgColor, history]);

  const addToHistory = () => {
    if (!text) return;
    const newItem = { text, qrColor, bgColor, id: Date.now() };
    const updatedHistory = [
      newItem,
      ...history.filter((item) => item.text !== text),
    ].slice(0, 5);
    setHistory(updatedHistory);
  };

  const downloadQRCode = () => {
    setDownloadState("processing");

    // Immediate execution for the download
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      try {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        addToHistory();
        setDownloadState("success");
      } catch (err) {
        console.error("Download failed", err);
        setDownloadState("idle");
      }
    }

    // Reset to idle after 2 seconds
    setTimeout(() => setDownloadState("idle"), 2000);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-muted uppercase px-2">
              Content for QR Code
            </h3>
            <div className="glass_card flex flex-col overflow-hidden !border-2">
              <textarea
                placeholder="Paste URL or text to generate QR code..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full p-5 text-sm outline-none bg-transparent resize-none border-none"
              />
              <div className="flex items-center justify-end p-3 bg-surface/30 border-t-2 border-border">
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="text-[10px] font-bold text-muted uppercase hover:text-red-500 transition-colors px-2"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted uppercase px-2">
                QR Color
              </span>
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted uppercase px-2">
                Bg Color
              </span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 p-2 max-h-40 overflow-y-auto no-scrollbar">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setText(item.text);
                  setQrColor(item.qrColor);
                  setBgColor(item.bgColor);
                }}
                className="glass_card p-2 flex items-center gap-3 cursor-pointer group hover:border-black dark:hover:border-white transition-all"
              >
                <div
                  className="w-4 h-4 rounded-sm border border-border"
                  style={{ backgroundColor: item.qrColor }}
                />
                <p className="flex-1 text-[10px] font-medium truncate opacity-60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 glass_card p-10">
          <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-6">
            <QRCodeCanvas
              id="qr-code-canvas"
              value={text || "https://swiftsuite.app"}
              size={220}
              fgColor={qrColor}
              bgColor={bgColor}
              includeMargin={true}
              level="H"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            {text ? (
              <>
                <p className="text-sm font-bold text-indigo-500 animate-pulse">
                  Live Preview
                </p>
                <button
                  onClick={downloadQRCode}
                  disabled={downloadState !== "idle"}
                  className={`btn_primary flex items-center gap-2 min-w-[160px] justify-center transition-all ${downloadState === "success" ? "!bg-emerald-600 !border-emerald-600" : ""}`}
                >
                  {downloadState === "processing" ? (
                    <>Processing... ⏳</>
                  ) : downloadState === "success" ? (
                    <>Saved! ✅</>
                  ) : (
                    <>Download PNG 📥</>
                  )}
                </button>
              </>
            ) : (
              <p className="text-xs text-muted italic">
                Enter text to generate your custom QR code
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRGenerator;
