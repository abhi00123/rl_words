# Universal Prefix-Based Word Generator

A lightning-fast, premium web application that allows users to instantly search for and select words based on any typed prefix. Featuring a massive underlying dictionary of exactly **386,584** deduplicated words, beautiful glassmorphism aesthetics, and real-time performance.

## Features

- ⚡ **Instant Search via Binary Search Tree Logic**: A custom `lowerBound` function instantly filters thousands of matches from the 386K word dataset without lagging the main browser thread.
- 🎨 **Premium Glassmorphism UI**: A fluid dark-theme gradient background is paired with a beautiful semi-transparent glass aesthetic interface. Micro-animations respond to interactions on both desktop and mobile devices.
- 📱 **Mobile & Touch Optimized**: Thoughtfully scaled padding, native-app viewport locking (disabling zoom tap), and frictionless touch scroll ensure perfect usability on any screen size.
- 💾 **Persistent Selections**: Words selected by the user are saved automatically via `localStorage` and persist even after browser refreshes.
- 🛠️ **Fully Vanilla Architecture**: Built entirely using pure HTML, CSS, and Vanilla JavaScript—no external frameworks or heavy dependencies. 

## Tech Stack
- **Structure:** Semantic HTML5
- **Styling:** Native CSS3 (CSS Variables, Flexbox, Transitions)
- **Typography:** [Outfit (Google Fonts)](https://fonts.google.com/specimen/Outfit)
- **Logic:** Vanilla JavaScript (ES6+), optimized algorithms
- **Generation:** PowerShell scripting to compile and scrub word data arrays.

## Setup & Running Locally
Since this is a fully Vanilla application with pre-complied word lists, there are no build steps required.

1. Clone or download this project folder.
2. Open the `index.html` file directly in any modern web browser.
*That's it!*

### (Optional) Dictionary Regeneration
If you want to re-run the script that fetches the dictionary, generates all 4-letter combos, and merges them:

1. Open PowerShell.
2. Navigate to the project folder.
3. Run the generator script:
   ```ps1
   powershell -ExecutionPolicy Bypass -File .\_generate.ps1
   ```
   *(Note: This might take a few moments to download and process nearly a million words!)*

---
Designed with aesthetics and real-time JavaScript performance in mind.
