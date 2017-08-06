import React from 'react';
import './styles/PlayerInfo.css';

const PlayerInfo = ({ playerName, playerScores, cardValues, isPlayerInRed, hasBlackJack}) => {
    //console.log("PlayerInfo: hasBlackJack:", hasBlackJack)
    console.log("PlayerZone: "+playerName+ " hasBJ: "+hasBlackJack)
    return (
        <div className="PlayerInfo">
            <span className={isPlayerInRed}>
                {playerName}: {playerScores} - {cardValues} {hasBlackJack && <span>BlackJack</span>}
                
            </span>
        </div>
    );
}
export default PlayerInfo;