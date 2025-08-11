const themes = {
  default: {
    '--bg-color': '#d1eef5ff',
    '--primary-color': '#a8d8ea',
    '--primary-hover': '#6ec6e6',
    '--card-bg': '#fff',
    '--text-color': '#555',
    '--text-light': '#fff'
  },
  dark: {
    '--bg-color': '#1e1f27ff',
    '--primary-color': '#4e5d6dff',
    '--primary-hover': '#3a4a5a',
    '--card-bg': '#2c3440',
    '--text-color': '#2c3272f',
    '--text-light': '#fff'
  },
  pastel: {
    '--bg-color': '#fdf6f0',
    '--primary-color': '#f7cac9',
    '--primary-hover': '#f5b7b1',
    '--card-bg': '#fff',
    '--text-color': '#6d6875',
    '--text-light': '#fff'
  },
  mint: {
    '--bg-color': '#e6fff7',
    '--primary-color': '#98ff98',
    '--primary-hover': '#6ee7b7',
    '--card-bg': '#fff',
    '--text-color': '#227c70',
    '--text-light': '#fff'
  },
  lavender: {
    '--bg-color': '#f3f0ff',
    '--primary-color': '#b8b5ff',
    '--primary-hover': '#9381ff',
    '--card-bg': '#fff',
    '--text-color': '#5e548e',
    '--text-light': '#fff'
  }
};

export function applyTheme(themeName) {
  const theme = themes[themeName] || themes.default;
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  localStorage.setItem('selectedTheme', themeName);
}

export function setupThemeSelector() {
  applyTheme(localStorage.getItem('selectedTheme') || 'default');
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    themeSelector.value = localStorage.getItem('selectedTheme') || 'default';
    themeSelector.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }
}