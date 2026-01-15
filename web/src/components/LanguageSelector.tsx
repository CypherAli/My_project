"use client";
import { useState, useRef, useEffect } from "react";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"EN" | "VN">("EN");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: "EN" | "VN") => {
    setSelectedLang(lang);
    setIsOpen(false);
    // Add your language switching logic here
    console.log(`Language changed to: ${lang}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-semibold">{selectedLang}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-[#1a1b3d] border border-white/10 shadow-xl overflow-hidden z-50">
          <button
            onClick={() => handleLanguageChange("EN")}
            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition ${
              selectedLang === "EN" ? "text-white bg-white/10" : "text-gray-300"
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageChange("VN")}
            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition ${
              selectedLang === "VN" ? "text-white bg-white/10" : "text-gray-300"
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
        </div>
      )}
    </div>
  );
}
