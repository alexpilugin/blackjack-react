import React, { Component } from 'react';
import './styles/App.css';
import GameLogic from './GameLogic';

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
      dead_heat: false
    }
  }

  getUID = () => {
    var uid = (new Date().getTime() + Math.random(1000)).toString(36)
    return uid;
  }

  reset = () => {
    //console.log("reset");
    this.game.reset();
    this.setState({
      turn: 0,
      currentPlayer: "player",
      playerLost: false,
      playerWin: false,
      dealerWin: false,
      dealerLost: false,
      dead_heat: false
    })
  }

  hit = () => {
    //console.log("hit");
    let curPlayer = 0;
    this.state.currentPlayer === "player" ? curPlayer = 0 : curPlayer = 1;
    this.game.moreCard(curPlayer);

    let playerScores = this.game.players[0].getScores();
    let dealerScores = this.game.players[1].getScores();

    if (this.state.currentPlayer !== "player") {
      if (dealerScores == 21) {
        this.setState({ dealerWin: true });
      }
      if (dealerScores < 21 && dealerScores > playerScores) {
        this.setState({ dealerWin: true });
      }
      if (dealerScores > 21) {
        this.setState({ dealerLost: true });
      }
      if (dealerScores === playerScores) {
        if (dealerScores > 16 && dealerScores < 21) {
          this.setState({ dead_heat: true });
        }
      }
      this.setState({ turn: this.state.turn++ });
    }
    //dead heat
    if (playerScores == 21) {
      this.setState({ playerWin: true });
    }
    if (playerScores > 21) {
      this.setState({ playerLost: true });
    } else {
      this.setState({ turn: this.state.turn++ });
    }
  }

  stay = () => {
    console.log("stay");
    this.setState({ currentPlayer: "dealer", turn: this.state.turn++ });
  }

  changeAceValue = (card) => {
    //console.log("changeAceValue");
    let curPlayer = 0;
    this.state.currentPlayer === "player" ? curPlayer = 0 : curPlayer = 1;
    //console.log(card);
    this.game.players[curPlayer].changeAceValue(card);
    let playerScores = this.game.players[curPlayer].getScores();

    if (this.state.currentPlayer !== "player") {
      if (playerScores == 21) {
        this.setState({ dealerWin: true });
      }
    }
    if (playerScores == 21) {
      this.setState({ playerWin: true });
    }
    this.setState({ turn: this.state.turn++ });
  }

  render() {
    //console.log(this.game)

    let player = this.game.players[0];
    let playerScores = player.getScores();
    let playerInRed = playerScores >= 21 ? "red" : null;
    let plValues = player.valuesToString();

    let dealer = this.game.players[1];
    let dealerScores = dealer.getScores();
    let dealerInRed = dealerScores >= 21 ? "red" : null;
    let dValues = dealer.valuesToString();

    if (this.state.dealerWin) return (
      <div className="App">
        <div className="App-header">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>

        <div className="App-intro white">
          <h2>Dealer win! <br />
            Dealer scores: {dealerScores} - {dValues}. <br />
            Player scores: {playerScores} - {plValues}.
          </h2>
          <div className="dealer-win"></div>
        </div>
      </div>
    )

    if (this.state.dead_heat) return (
      <div className="App">
        <div className="App-header ">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>

        <div className="App-intro white">
          <h2>Dead heat! <br />
            Dealer scores: {dealerScores} - {dValues}. <br />
            Player scores: {playerScores} - {plValues}.
          </h2>
          <div className="dead-heat"></div>

        </div>
      </div>
    )

    if (this.state.dealerLost) return (
      <div className="App">
        <div className="App-header ">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>

        <div className="App-intro white">
          <h2>Dealer lost! <br />
            Dealer scores: {dealerScores} - {dValues}. <br />
            Player scores: {playerScores} - {plValues}.
          </h2>
          <div className="dealer-failed"></div>

        </div>
      </div>
    )

    if (this.state.playerWin) return (
      <div className="App">
        <div className="App-header">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>

        <div className="App-intro white">
          <h2>You win! <br />
            Player scores: {playerScores} - {plValues}. <br />
            Dealer scores: {dealerScores} {dValues}.
          </h2>
          <div className="win"></div>
        </div>
      </div>
    )

    if (this.state.playerLost) return (
      <div className="App">
        <div className="App-header">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>
        <div className="App-intro white">
          <h2>You LOST!  <br />
            Player scores: {playerScores} - {plValues} <br />
            Dealer scores: {dealerScores} - {dValues}.
          </h2>
          <div className="player-lost"></div>
        </div>
      </div>
    )

    return (
      <div className="App">
        <div className="App-header">
          <h2>Black Jack</h2><button id="reset" onClick={this.reset}>New Game</button>
        </div>
        <div className="hints">
          <p>Hint: Click the Ace card to change its value (1 or 11)</p>
        </div>
        <div className="App-intro">

          <div className="playerZone">
            <span className={playerInRed}>
              {player.getName()}: {playerScores}
              {(this.state.currentPlayer !== "player" || playerInRed) ? null :
                <div>
                  <button id="hit" className={"button"} onClick={this.hit}>Hit!</button>
                  <button id="stay" className={"button"} onClick={this.stay}>Stay!</button>
                </div>
              }
            </span>

            {player.cards.map(card =>
              <Card
                key={this.getUID()}
                data={card}
                click={this.changeAceValue}
              />
            )}

          </div>
          <div className="playerZone">
            <span className={dealerInRed}>
              {dealer.getName()}:{dealerScores}
              {this.state.currentPlayer !== "player" &&
                <button id="hit" onClick={this.hit}>Hit!</button>
              }

            </span>
            {dealer.cards.map(card =>
              <Card
                key={this.getUID()}
                data={card}
                click={this.changeAceValue}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

class Card extends Component {

  clickHandler = () => {
    this.props.click(this.props.data);
  }

  render() {
    var cardStyle = {
      backgroundPosition: `-${157.52 * this.props.data.spriteNum}px 0px`
    };
    let value = this.props.data.value;
    let clickableCard = (value === 1 || value === 11) ? "clickable Card" : "Card";
    return (
      <div className={clickableCard} style={cardStyle} onClick={this.clickHandler}>
      </div>
    )
  }
}


export default App;
