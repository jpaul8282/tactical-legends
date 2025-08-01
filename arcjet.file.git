// Protect against bots & common attacks e.g. SQL injection, XSS, CSRF
import arcjet, { shield, detectBot } from "@arcjet/node";

const aj = arcjet({
  // ARCJET_KEY automatically set by the Netlify integration
  // Log in at https://app.arcjet.com
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks e.g. SQL injection, XSS, CSRF
    shield({
      // Will block requests. Use "DRY_RUN" to log only
      mode: "LIVE",
    }),
    // Detect bots
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except search engine crawlers. See the full list of bots
      // for other options: https://arcjet.com/bot-list
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});
