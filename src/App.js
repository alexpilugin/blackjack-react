import React, { Component } from 'react';
import GameLogic from './GameLogic';
import AppHeader from './AppHeader';
import PlayerZone from './PlayerZone';
import ShowResult from './ShowResult';

import './styles/App.css';

class App extends Component {

  constructor() {
    super();
    this.game = new GameLogic()
    this.state = {
      turn: 0,
      currentPlayer: "player",
      playerLost: false,
      playerWin: false,
      dealerWin: false,
      dealerLost: false,
      standOff: false,
      playerHasBlackJack: false,
      dealerHasBlackJack: false,
      playerStop: false
    }
  }

  getUID = () => (Date.now() + Math.random(1000000));

  reset = () => {
    //console.log("reset");
    this.game.reset();
    const pHasBlackJack = this.game.isPlayerBlackJack;
    const currPlayer = pHasBlackJack ? "dealer" : "player";
    let plWon = false;
    //console.log("pHasBlackJack:", pHasBlackJack)
    if (pHasBlackJack) {
      const dealerScores = this.game.players[1].getScores();
      let dealerHasChanse = (dealerScores === 10 || dealerScores === 11) ? true : false;
      if (!dealerHasChanse) plWon = true
    }
    this.setState({
      turn: 0,
      currentPlayer: currPlayer,
      playerLost: false,
      playerWin: plWon,
      dealerWin: false,
      dealerLost: false,
      standOff: false,
      playerHasBlackJack: pHasBlackJack,
      dealerHasBlackJack: false,
      playerStop: false
    })
  }

  hit = () => {
    //console.log("hit");
    let curPlayer = this.state.currentPlayer === "player" ? 0 : 1;
    this.game.moreCard(curPlayer);

    let playerScores = this.game.players[0].getScores();
    let dealerScores = this.game.players[1].getScores();

    if (playerScores > 21) {
      this.setState({ playerLost: true });
    }
    if (playerScores === 21) {
      this.setState({ playerStop: true, currentPlayer: "dealer" });
    }

    //Dealer:
    if (this.state.currentPlayer !== "player") {

      const dealerHasTwoCards = (this.game.players[1].cards.length === 2) ? true : false;
      //console.log("dealer cards amount:", this.game.players[1].cards.length);
      //console.log("dealer has 2 cards:", dealerHasTwoCards);

      if(dealerHasTwoCards && dealerScores === 21){
        this.setState({ dealerHasBlackJack: true });
      }

      //11 + 11 -> 1+1
      if (dealerScores > 21) {
        if (dealerHasTwoCards) {
          const firstAce = this.game.players[1].cards[0];
          const secondAce = this.game.players[1].cards[1];

          firstAce.value = 1;
          secondAce.value = 1;
          this.game.players[1].estimate();

          this.setState({ turn: this.state.turn + 1 });
          return;
        } else {
          this.setState({ dealerLost: true });
        }
        return;
      }

      //BlackJack vs BlackJack
      if (dealerHasTwoCards && this.state.playerHasBlackJack) {
        if (dealerScores !== 21) {
          this.setState({ playerWin: true });
        } else {
          console.log("BOTH HAVE BJ (STANDOFF)")
          this.setState({ standOff: true, dealerHasBlackJack: true });
        }
        return;
      }

      if (dealerScores >= 17 && dealerScores < 21) {
        if (dealerScores === playerScores) {
          this.setState({ standOff: true });
        }
        if (dealerScores > playerScores) {
          this.setState({ dealerWin: true });
        } else {
          this.setState({ playerWin: true });
        }
        return;
      }

      if (dealerScores === 21) {
        //console.log("Dealer has 21");

        if (dealerScores > playerScores) {
          this.setState({ dealerWin: true });
          return;
        }
        if (dealerHasTwoCards) {
          //console.log("Dealer has BJ (129)")
          this.setState({ dealerHasBlackJack: true, dealerWin: true });
          return;
        }

        if (dealerScores === playerScores) {
          this.setState({ standOff: true });
        }

      }

    }

    this.setState({ turn: this.state.turn++ });
  }

  stay = () => {
    //console.log("stay");
    this.setState({ currentPlayer: "dealer", playerStop: true, turn: this.state.turn++ });
  }

  changeAceValue = (card) => {
    //console.log("changeAceValue");
    let curPlayer = 0;
    this.state.currentPlayer === "player" ? curPlayer = 0 : curPlayer = 1;
    //console.log(card);
    this.game.players[curPlayer].changeAceValue(card);
    let playerScores = this.game.players[curPlayer].getScores();

    if (this.state.currentPlayer !== "player") {
      if (playerScores === 21) {
        this.setState({ dealerWin: true });
      }
    }
    if (playerScores === 21) {
      this.setState({ currentPlayer: "dealer", playerStop: true });
    }
    this.setState({ turn: this.state.turn++ });
  }

  render() {
    //console.log(this.game)

    const currPlayerIsPlayer = this.state.currentPlayer === "player";

    let player = this.game.players[0];
    let playerScores = player.getScores();
    let playerInRed = playerScores >= 21 ? "red" : null;
    let plValues = player.valuesToString();
    let playerStop = this.state.playerStop;
    let playerHasBlackJack = this.state.playerHasBlackJack;
    //console.log("App render: Player has BJ:", playerHasBlackJack)

    let dealer = this.game.players[1];
    let dealerScores = dealer.getScores();
    let dealerInRed = dealerScores >= 21 ? "red" : null;
    let dValues = dealer.valuesToString();
    let dHasBlackJack = this.state.dealerHasBlackJack;
    //console.log("App render: Dealer has BJ:", dHasBlackJack)

    let playersState = [];
    playersState.push({
      name: player.name,
      scores: playerScores,
      values: plValues,
      inRed: playerInRed,
      hasBlackJack: playerHasBlackJack
    })
    playersState.push({
      name: dealer.name,
      scores: dealerScores,
      values: dValues,
      inRed: dealerInRed,
      hasBlackJack: dHasBlackJack
    })

    if (this.state.dealerWin) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <ShowResult
          playerStates={playersState}
          message={'DEALER WON!'}
          cssClass={'dealer-win'}
        />
      </div>
    )

    if (this.state.standOff) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <ShowResult
          playerStates={playersState}
          message={'STANDOFF! Equal scores!'}
          cssClass={'StandOff'}
        />
      </div>
    )

    if (this.state.dealerLost) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <ShowResult
          playerStates={playersState}
          message={'You won!'}
          cssClass={'dealer-failed'}
        />
      </div>
    )

    if (this.state.playerWin) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <ShowResult
          playerStates={playersState}
          message={'YOU WON!'}
          cssClass={'win'}
        />
      </div>
    )

    if (this.state.playerLost) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <ShowResult
          playerStates={playersState}
          message={'Too much! You failed!'}
          cssClass={'player-lost'}
        />
      </div>
    )

    if (playerHasBlackJack) return (
      <div className="App">
        <AppHeader clickReset={this.reset} />
        <div className="GameTable white">
          <PlayerZone
            player={player}
            hasBlackJack={playerHasBlackJack}
          />
          <PlayerZone
            player={dealer}
            hitClick={this.hit}
            clickAce={this.changeAceValue}
            hideButton={currPlayerIsPlayer}
          />
        </div>
      </div>
    )

    return (
      <div className="App">
        <AppHeader clickReset={this.reset} />

        <div className="GameTable white">
          <PlayerZone
            player={player}
            hitClick={this.hit}
            stayClick={this.stay}
            clickAce={this.changeAceValue}
            hasBlackJack={playerHasBlackJack}
            stop={playerStop}
          />
          <PlayerZone
            player={dealer}
            hitClick={this.hit}
            clickAce={this.changeAceValue}
            hideButton={currPlayerIsPlayer}
            hasBlackJack={dHasBlackJack}
          />
        </div>
      </div>
    )

  }
}


export default App;
