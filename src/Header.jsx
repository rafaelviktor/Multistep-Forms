import React from 'react';
import './App.css';

function Header({ language, changeLanguage }) {
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    changeLanguage(selectedLanguage);
  };

  return (
    <header id="header">
      <div className="container">
        <h1>Example Forms</h1>
        <div className="language-selector">
          <label htmlFor="language">Language: </label>
          <select id="language" value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;