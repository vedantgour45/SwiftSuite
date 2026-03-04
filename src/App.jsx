import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import LinkShortener from "./components/LinkShortener";
import TextSummarizer from "./components/TextSummarizer";
import GrammarChecker from "./components/GrammarChecker";
import Translator from "./components/Translator";
import Paraphraser from "./components/Paraphraser";
import PasswordGenerator from "./components/PasswordGenerator";
import JsonFormatter from "./components/JsonFormatter";
import WordCounter from "./components/WordCounter";
import QRGenerator from "./components/QRGenerator";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [activeTab, setActiveTab] = useState("article");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const tabs = [
    { id: "article", label: "📰 Article Summarizer" },
    { id: "text", label: "📝 Text Summarizer" },
    { id: "grammar", label: "✅ Proofreader" },
    { id: "translate", label: "🌍 Translator" },
    { id: "paraphrase", label: "🔄 Tone Adjuster" },
    { id: "shorten", label: "🔗 Link Shortener" },
    { id: "password", label: "🔑 Password Generator" },
    { id: "json", label: "{ } JSON Formatter" },
    { id: "stats", label: "📊 Content Insights" },
    { id: "qr", label: "📱 QR Code Generator" },
  ];

  return (
    <div className="min-h-screen">
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app_container">
        <Navbar />
        <Hero />

        <div className="tabs_wrapper">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab_btn ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main className="w-full mt-10 flex flex-col items-center min-h-[400px]">
          {activeTab === "article" && <Demo />}
          {activeTab === "text" && <TextSummarizer />}
          {activeTab === "grammar" && <GrammarChecker />}
          {activeTab === "translate" && <Translator />}
          {activeTab === "paraphrase" && <Paraphraser />}
          {activeTab === "shorten" && <LinkShortener />}
          {activeTab === "password" && <PasswordGenerator />}
          {activeTab === "json" && <JsonFormatter />}
          {activeTab === "stats" && <WordCounter />}
          {activeTab === "qr" && <QRGenerator />}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
