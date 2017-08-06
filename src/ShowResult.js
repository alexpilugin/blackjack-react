import React from 'react';
import PlayerInfo from './PlayerInfo';
import './styles/ShowResult.css';

const ShowResult = ({ playerStates, message, cssClass }) => {
    const getUID = () => (new Date().getTime() + Math.random(1000)).toString(36);
    return (
        <div className="GameTable white">
            <h2>{message}</h2>
            {playerStates.map(info =>
                <PlayerInfo
                    key={getUID()}
                    playerName={info.name}
                    playerScores={info.scores}
                    cardValues={info.values}
                    isPlayerInRed={info.inRed}
                    hasBlackJack={info.hasBlackJack}
                />
            )}
            <div className={cssClass}></div>
        </div>
    )
}
export default ShowResult;