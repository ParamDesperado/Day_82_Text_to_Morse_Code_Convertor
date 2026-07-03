# 📡 Morse Code Converter

A sleek, publish-ready **Text ↔ Morse Code Converter** built as part of **Day 82 of the 100 Days of Code** challenge.

Convert English text to Morse code and back — instantly. Features real-time translation, Morse audio playback, a visual dot-dash display, and a full interactive reference chart.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔄 **Bidirectional** | English → Morse and Morse → English |
| ⚡ **Real-time** | Translates as you type |
| 🔊 **Audio Playback** | Hear your Morse code using the Web Audio API |
| 🎨 **Visual Display** | Animated dot/dash visualizer lights up during playback |
| 📋 **Copy to Clipboard** | One-click copy of the output |
| 💾 **Download** | Save your translation as a `.txt` file |
| 🗂️ **Reference Chart** | Interactive A–Z, 0–9 & punctuation cheat sheet |
| ♿ **Accessible** | Full ARIA support, keyboard navigation, reduced-motion safe |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🚀 Getting Started

### Web App (Recommended)

No build step needed — it's plain HTML, CSS, and JavaScript.

```bash
# Option 1: open directly in browser
start index.html

# Option 2: serve with a local HTTP server (recommended for clipboard API)
npx serve .
# or
python -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

### CLI (Python)

```bash
python main.py
```

Requires **Python 3.6+**. No external dependencies.

---

## 🗂️ Project Structure

```
Day_82_Text_to_Morse_Code_Convertor/
├── index.html     # Web app — HTML structure & semantics
├── style.css      # Glassmorphism dark-mode UI with animations
├── app.js         # Translation logic, audio, reference chart
└── main.py        # Python CLI version (bidirectional)
```

---

## 🔡 Morse Code Reference

The dictionary includes **36 characters** — letters A–Z, digits 0–9 — plus **18 punctuation symbols**:

`. , ? ' ! / ( ) & : ; = + - _ " $ @`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS (Glassmorphism + animations) |
| Logic | Vanilla JavaScript (ES6+, Web Audio API) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Icons | Font Awesome 6 |

---

## 🧪 How Morse Code Works

- **Dot (·)** = 1 unit
- **Dash (–)** = 3 units
- **Gap between symbols** = 1 unit
- **Gap between letters** = 3 units
- **Gap between words** = 7 units (represented by `/`)

---

## 👤 Author

**Param Sangani** — Day 82 of the [100 Days of Code](https://www.100daysofcode.com/) challenge.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
