# 🌟 SparkLocal – Local Date Ideas App

**SparkLocal** is a modern, mobile-first app built with **React Native + Expo** that helps users discover, save, and share unique date ideas based on location, weather, preferences, and mood. Whether you're in the mood for something spontaneous, romantic, adventurous, or chill — SparkLocal has you covered.

> ✨ Built with ❤️ by [Samuel Snow](https://samuelesnow.co)

---

## 📱 Features

### 🏠 Homepage
- Curated list of over 20+ pre-made date ideas in San Francisco
- Real-time weather conditions for each date idea using OpenWeather API
- "Surprise Me" button for random suggestions, based on mood, weather, time, and price
- “Date of the Day” widget that refreshes daily
- Welcome message and onboarding overlay for new users

### 🔍 Search
- Search by:
  - Name
  - Location
  - Price: $, $$, $$$
  - Time: 30 min, 1 hr, 2+ hrs
  - Mood/Vibe: Romantic, Adventurous, Chill, Creative, Funny
- Toggle to view results on a map (with pins based on GPS)

### ❤️ Saved
- Save any date idea to your list
- List or Grid view toggle
- Remove saved ideas
- View detailed info and weather
- View statistics like saved count and completed dates

### ⚙️ Settings
All options open as animated overlays:
- **Themes**: Sunset 🌇, Midnight 🌌, Neon, Forest, Ocean, and more
- **Appearance**: Light / Dark / System mode
- **Notifications**: Toggle alerts and popups
- **Language**: English & Spanish support
- **Accessibility**:
  - Font size adjustments
  - High contrast mode
  - VoiceOver support
- **Legal & Info**:
  - Terms and Conditions
  - Safety Policy
  - What’s New (Changelog)
  - About SparkLocal (with a link to [samuelesnow.co](https://samuelesnow.co))

---

## 🌦️ Weather Awareness
- Uses OpenWeather API to show:
  - Temperature
  - Conditions (e.g., sunny, raining)
  - Weather icons
- Dynamically suggests indoor or outdoor ideas based on real-time weather
- Weather data shown per location for each idea
- Fallback handling if API fails

---

## 🧠 Bonus Features

### 🔁 Surprise Me
- Randomly selects a date idea
- Includes filters for:
  - Mood
  - Time
  - Weather
  - Price
- "Shuffle Again" button for quick discovery

### 🧑‍🎨 Custom Themes
- User-selectable color themes: Midnight, Sunset, Neon, etc.
- Theme preferences saved with persistence

### ✨ Animated Reactions
- Confetti and effects when users save ideas or complete quizzes
- Haptic feedback on supported devices

### 📤 One-Tap Share
- Share any date idea as a designed card via:
  - Text
  - Instagram
  - iMessage

### 🧩 Feature Flags (Dev Tools)
- Toggle beta features like:
  - AI Chat Assistant
  - Achievements
  - Premium tier
  - Debug Mode
- Accessible through Developer Tools in Settings

### 🧑‍🚀 Achievements
- Earn badges for:
  - Saving ideas
  - Completing dates
  - Submitting custom ideas
  - Taking quizzes
  - Exploring different vibes

---

## 🔐 Authentication
- Uses Firebase Authentication
- Google Login integration
- Profile page shows:
  - Display name
  - Email
  - Stats
  - Profile picture (editable)

---

## 📬 User Submissions
- Submit a custom date idea through an animated form
- Fields:
  - Title
  - Description
  - Location
  - Optional: price, image, website link
- Automatically emails submission to `ssnow@sterneschool.org`
- Confirmation overlay on successful submission

---

## 💬 AI Chat Assistant
- Powered by Google Gemini API
- Users can ask open-ended questions like:
  > "What’s a romantic date in SF this weekend under $30?"
- Returns custom suggestions and links

---

## 🛠️ Built With
- **React Native + Expo**
- **Firebase** (Auth & future DB integration)
- **OpenWeather API** for live weather
- **Zustand** for state management
- **Tailwind (via custom utilities)** for consistent styling
- **Lucide Icons**, custom modals, overlays, animations

---

## 👤 About the Creator

This app was designed and developed by [**Samuel Snow**](https://samuelesnow.co), a passionate builder, UI/UX designer, and creative mind based in San Francisco. Sam is always looking for ways to make fun, helpful, and beautiful apps that improve everyday life.

🔗 Visit his site: [samuelesnow.co](https://samuelesnow.co)  
📫 Reach out: `ssnow@sterneschool.org`

---

## 📦 Installation (Dev Only)

```bash
git clone https://github.com/YOUR_USERNAME/sparklocal.git
cd sparklocal
bun install
bun expo start --web --tunnel
