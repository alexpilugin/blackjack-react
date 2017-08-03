const BLACK_JACK = 21;

const cardValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

class Card {
    constructor(spriteNum, value) {
        this.spriteNum = spriteNum;
        this.value = value;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.scores = 0;
        this.hasAces = false;
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
        if (card.value == 1 || card.value == 11) this.hasAces = true;
        this.estimate();
    }
    changeAceValue(card) {
        if (!card) return;
        console.log(card);
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].spriteNum === card.spriteNum && this.cards[i].value === card.value) {
                if (this.cards[i].value === 1) {
                    this.cards[i].value = 11;
                    console.log("A");
                    break;
                }
                if (this.cards[i].value === 11) {
                    this.cards[i].value = 1;
                    console.log("B");
                    break;
                }
                console.log("value: " + this.cards[i].value)
            }
        }
        this.estimate();
    }
    getScores = () => this.scores
    getName = () => this.name
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
        this.playerWin = false
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
        cardOrder.forEach((spriteNum) => this.cards.push(new Card(spriteNum, cardValues[spriteNum])))

        //player:
        this.players[0].addCard(this.cards.pop())
        this.players[0].addCard(this.cards.pop())

        //dealer:
        this.players[1].addCard(this.cards.pop())
    }
    moreCard(playerID) {
        this.players[playerID].addCard(this.cards.pop())
    }
}


export default GameLogic;