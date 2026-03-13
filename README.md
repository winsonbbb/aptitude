# Aptitude Practice

A simple web platform to practice aptitude tests by section. Revise **Numerical**, **Verbal**, and **Logical** reasoning with multiple-choice questions and instant feedback.

## How to run

1. Open `index.html` in a browser (double-click or drag into Chrome/Edge/Firefox),  
   **or**
2. Serve the folder with any static server, for example:
   ```bash
   npx serve .
   ```
   Then open the URL shown (e.g. http://localhost:3000).

## Features

- **Revision by section**: Choose Numerical, Verbal, or Logical reasoning.
- **Numerical**: Percentages, ratios, averages, and basic calculations.
- **Verbal**: Synonyms, antonyms, and word meaning.
- **Logical**: Number sequences and pattern “next number” questions.
- **Instant feedback**: Check your answer and see a short explanation.
- **Score**: Tracks correct answers per section.

## Structure

- `index.html` — Single-page layout and navigation
- `css/style.css` — Styles
- `js/questions.js` — Question bank (10 questions per category)
- `js/app.js` — Navigation and quiz logic

You can add or edit questions in `js/questions.js` (see the `APTITUDE_QUESTIONS` object).
