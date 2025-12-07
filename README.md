<div align="center">
  <img src="assets/Rajflix.png" alt="RajFlix Banner" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
</div>

<br/>

# 🎬 RajFlix - AI-Powered Movie Browser

A modern, Netflix-inspired movie and TV show browsing application powered by AI. Built with React, TypeScript, and Vite, RajFlix provides an intuitive interface to discover trending content, search for your favorites, and get personalized recommendations using Google's Gemini AI.

## ✨ Features

- 🎯 **Browse Movies & TV Shows**: Explore trending content, top-rated movies, and popular TV series
- 🔍 **Smart Search**: Quickly find your favorite movies and shows
- 🤖 **AI-Powered Suggestions**: Get personalized movie recommendations using Google Gemini AI
- 🎨 **Beautiful UI**: Netflix-inspired responsive design with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Detailed Information**: View comprehensive details about movies and shows including cast, ratings, and synopsis
- 🎬 **Categories**: Browse by genre - Action, Comedy, Horror, Romance, Documentaries, and more

## 🛠️ Technologies Used

- **React 19.2.1** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Google Gemini AI** - AI-powered movie suggestions
- **TMDB API** - Movie and TV show data
- **CSS3** - Styling and animations

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **TMDB API Key** (free from [themoviedb.org](https://www.themoviedb.org/settings/api))
- **Google Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajkumar-21/RajFlix.git
   cd RajFlix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages via GitHub Actions.

### Setup GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key

### Automatic Deployment

The app automatically deploys to GitHub Pages when you:
- Push to the `main` branch
- Manually trigger the workflow from the Actions tab

Your app will be available at: `https://rajkumar-21.github.io/RajFlix/`

### Manual Deployment Trigger

1. Go to the **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## 📁 Project Structure

```
RajFlix/
├── components/           # React components
│   ├── AboutModal.tsx    # About information modal
│   ├── AiSuggester.tsx   # AI-powered movie suggestions
│   ├── ApiKeyModal.tsx   # API key configuration
│   ├── Banner.tsx        # Hero banner component
│   ├── Header.tsx        # Navigation header
│   ├── Loader.tsx        # Loading spinner
│   ├── MovieCard.tsx     # Movie/TV show card
│   ├── MovieModal.tsx    # Movie details modal
│   ├── Row.tsx           # Horizontal content row
│   └── SearchResults.tsx # Search results display
├── services/             # API services
│   ├── geminiService.ts  # Google Gemini AI integration
│   └── tmdbService.ts    # TMDB API integration
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
├── types.ts              # TypeScript type definitions
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies

```

## 🔑 API Keys

This application requires two API keys:

1. **TMDB API Key**: Used for fetching movie and TV show data
   - Get it from: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Note: The TMDB key is currently hardcoded in `tmdbService.ts`

2. **Google Gemini API Key**: Used for AI-powered movie suggestions
   - Get it from: [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Set as `GEMINI_API_KEY` environment variable

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Rajkumar-21/RajFlix/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👨‍💻 Author

**Rajkumar**
- GitHub: [@Rajkumar-21](https://github.com/Rajkumar-21)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Google Gemini AI](https://ai.google.dev/) for AI-powered suggestions
- Inspired by Netflix's UI/UX design

---

Made with ❤️ by Rajkumar
