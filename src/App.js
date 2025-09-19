import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  const themes = ['dark', 'light', 'ice', 'nature', 'fire'];
  const themeIcons = useMemo(() => ({
    dark: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    ),
    light: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.95 19.07l1.41 1.41 1.8-1.79-1.42-1.42-1.79 1.8zM17 22h2v-3h-2v3zM20 13h3v-2h-3v2zM17.66 4.84l1.41-1.41-1.79-1.8-1.42 1.42 1.8 1.79zM12 6a6 6 0 100 12 6 6 0 000-12z"></path>
      </svg>
    ),
    ice: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11 2h2v20h-2z"></path>
        <path d="M4.22 5.64l1.41-1.41 14.14 14.14-1.41 1.41z"></path>
        <path d="M19.36 5.64l-1.41-1.41L3.81 18.36l1.41 1.41z"></path>
      </svg>
    ),
    nature: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5 21c8 0 13-7 13-13 0-.34 0-.67-.03-1A9.985 9.985 0 0 1 5 19v2z"></path>
        <path d="M5 21v-2a9 9 0 0 0 9-9h2c0 6.08-4.92 11-11 11z"></path>
      </svg>
    ),
    fire: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 5.5S12 2 8 2c0 0 1 3-1 5S3 11 3 14a9 9 0 0 0 18 0c0-5-4-7-7.5-8.5z"></path>
      </svg>
    ),
  }), []);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('theme');
    return themes.includes(saved) ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Libardo<br />Tic Tac Toe</h1>
        <div className="theme-toggle">
          {themes.map((t) => (
            <button
              className={`theme-btn${theme === t ? ' active' : ''}`}
              key={t}
              onClick={() => setTheme(t)}
              aria-pressed={theme === t}
              title={`Switch to ${t} theme`}
            >
              <span className="theme-icon" aria-hidden="true">{themeIcons[t]}</span>
              <span className="theme-label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </div>
        <Game />
      </header>
    </div>
  );
}

export default App;
