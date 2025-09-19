import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  const themes = ['dark', 'light', 'ice', 'nature', 'fire'];
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              aria-pressed={theme === t}
              title={`Switch to ${t} theme`}
              style={theme === t ? { outline: '3px solid rgba(97, 218, 251, 0.35)' } : undefined}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <Game />
      </header>
    </div>
  );
}

export default App;
