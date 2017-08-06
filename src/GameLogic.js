const cardValues = [
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 20, 20,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 20, 20,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 20, 20,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 20, 20];

class Card {
    constructor(spriteNum, value, faceCard) {
        this.spriteNum = spriteNum;
        this.value = value;
        this.faceCard = faceCard /* J, Q, K */ 
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.scores = 0;
    }
    estimate() {
        let scores = 0;
        this.cards.forEach((card) => {
            scores += card.value;
        })
        this.scores = scores;
    }
    addCard(card) {
        this.cards.push(card);
        this.estimate();
    }
    changeAceValue(card) {
        if (!card) return;
        //console.log(card);
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].spriteNum === card.spriteNum && this.cards[i].value === card.value) {
                if (this.cards[i].value === 1) {
                    this.cards[i].value = 11;
                    break;
                }
                if (this.cards[i].value === 11) {
                    this.cards[i].value = 1;
                    break;
                }
                //console.log("value: " + this.cards[i].value)
            }
        }
        this.estimate();
    }
    getScores = () => this.scores;
    getName = () => this.name;
    valuesToString = () => {
        let str = "";
        this.cards.forEach((card) => {
            str += "" + card.value + ", ";
        })
        return str;
    }
}

class GameLogic {
    constructor() {
        this.cards = [];
        this.players = [];
        this.dealerTurn = false;
        this.playerWin = false;
        this.isPlayerBlackJack = false;
        this.reset();
    }

    shuffle() {
        let cardSet = [];
        let counter = 0;
        let end = 51;
        while (counter <= end) {
            cardSet.push(counter);
            counter++;
        }
        var j, x, i;
        for (i = cardSet.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = cardSet[i - 1];
            cardSet[i - 1] = cardSet[j];
            cardSet[j] = x;
        }
        //console.log(cardSet);
        return cardSet;
    }

    reset() {
        this.players = [];
        this.players.push(new Player("Player"));
        this.players.push(new Player("Dealer"))

        let cardOrder = this.shuffle();

        cardOrder.forEach((spriteNum) => {
            const cardValue = cardValues[spriteNum];
            if (cardValue === 20) {
                this.cards.push(new Card(spriteNum, 10, true))    
            } else {
                this.cards.push(new Card(spriteNum, cardValue, false))
            }           
        })

        //player:
        this.players[0].addCard(this.cards.pop())
        this.players[0].addCard(this.cards.pop())

        const playerScores = this.players[0].getScores();
        if(playerScores === 21) {
            this.isPlayerBlackJack = true;
        } else {this.isPlayerBlackJack = false;}

        if(playerScores === 22) {
            this.players[0].cards[0].value = 1; 
            this.players[0].cards[1].value = 1; 
            this.players[0].estimate();  
        }

        //dealer:
        this.players[1].addCard(this.cards.pop())
    }
    moreCard(playerID) {
        this.players[playerID].addCard(this.cards.pop())
    }
}


export default GameLogic;