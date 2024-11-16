"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export const GoogleTranslate: React.FC = () => {
  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Translate script failed to load"));
        document.body.appendChild(script);
      });
    };

    const initializeGoogleTranslate = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr", // English, Hindi, Marathi
            layout: 1, // SIMPLE layout
          },
          "google_translate_element"
        );
      }
    };

    // Define the global callback for the Google Translate API
    window.googleTranslateElementInit = initializeGoogleTranslate;

    // Load the Google Translate script
    loadGoogleTranslateScript().catch((err) => {
      console.error("Error loading Google Translate script:", err);
    });

    return () => {
      // Clean up by removing the script
      const script = document.querySelector(
        'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );
      if (script) script.remove();
    };
  }, []);

  return <div id="google_translate_element" className="mt-2"></div>;
};
