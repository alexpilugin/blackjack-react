import React from 'react';
import './styles/AppHeader.css';

const AppHeader = ({clickReset}) => {
  return (
    <div className="AppHeader">
        <div className="topLine">
            <h2>Black Jack</h2>
            <button id="reset" onClick={clickReset}>New Game</button>
        </div>
      <div className="hints">
        <p>Hint: Click the Ace card to change its value (1 or 11)</p>
      </div>
    </div>
  );
}

export default AppHeader;