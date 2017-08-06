import React from 'react';
import PlayerInfo from './PlayerInfo';
import Card from './Card';

import './styles/PlayerZone.css';

const PlayerZone = ({ player, hasBlackJack, hitClick, stayClick, clickAce, stop, hideButton }) => {
    let playerScores = player.getScores();
    let cardValues = player.valuesToString();
    let playerInRed = playerScores >= 21 ? "red" : null;

    let showButtons = true;
    if(stop || hasBlackJack || hideButton) showButtons = false;   

    const getUID = () => (Date.now() + Math.random(1000000));

    //console.log("PlayerZone: "+player.getName()+ " hasBJ: "+hasBlackJack)

    return (
        <div className="playerZone">
            <div className="header">
                <PlayerInfo
                    playerName={player.getName()}
                    playerScores={playerScores}
                    cardValues={cardValues}
                    isPlayerInRed={playerInRed}
                    hasBlackJack={hasBlackJack}
                />
                {(showButtons && hitClick) && <button id="hit" onClick={hitClick}>Hit!</button>}
                {(showButtons && stayClick) && <button id="stay" onClick={stayClick}>Stay!</button>}
            </div>
            <div className="field">
                {player.cards.map(card =>
                    <Card
                        key={getUID()}
                        data={card}
                        click={clickAce}
                    />
                )}
            </div>
        </div>
    );
}
export default PlayerZone;