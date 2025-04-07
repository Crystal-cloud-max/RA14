"use strict";

//The squareGame object contains properties and methods for the game of Poker Squares
var squareGame = {
    //stores total points
    gameTotal: 0,

    //stores point total required for winning the game
    winTotal: 50,

   //array for poker hands
   cardGrid: [new pokerHand(),
              new pokerHand(),
              new pokerHand(),
              new pokerHand(),
              new pokerHand()],
   
   //calculate 5 row points by calling function to the array
   calcRowPoints: function(index) {
      return this.cardGrid[index].handPoints();
   },

   //calculate 5 column points
   calcColumnPoints: function(index) {
      var columnHand = new pokerHand(5);
      for (var i = 0; i < 5; i++) {
         columnHand.cards[i] = this.cardGrid[i].cards[index];
      }
      return columnHand.handPoints();//call function
   },

   //display if player won or lost depending on the total for game
    gameResult: function () {
        if (this.gameTotal >= this.winTotal) {
            return "Winner";
        }
        else {
            return "No Winner";
        }
    }
};//end of squareGame

//inserts a card into a poker hand at a specified index
pokerHand.prototype.insertCard = function (card, index) {
    this.cards[index] = card;//array from pokerDeck function
};

/* ------- Poker Style Custom Objects ---------- */

/*  The pokerCard object contains properties and methods associated with
    individual poker cards including the card rank, suit, and value.
 */
function pokerCard(cardSuit, cardRank) {
   this.suit = cardSuit;
   this.rank = cardRank;
   this.rankValue = null;
}

/* Method to reference the image source file for a card */
pokerCard.prototype.cardImage = function () {
    //letter abbreviation for wuit by extracting 1st character in lowercase like c
   var suitAbbr = this.suit.substring(0, 1).toLowerCase();
   return suitAbbr + this.rankValue + ".png";
};

/* Method to replace a card with a one from the deck */
pokerCard.prototype.replaceFromDeck = function (pokerDeck) {
    //cards array from pokerDeck function
   this.suit = pokerDeck.cards[0].suit;
   this.rank = pokerDeck.cards[0].rank;
   this.rankValue = pokerDeck.cards[0].rankValue;
   pokerDeck.cards.shift();//remove from 1st element of array
}

/*  The pokerDeck object contains an array of poker cards and methods
    for shuffling and drawing cards from the deck.
 */
function pokerDeck() {
   this.cards = new Array(52);//array with 52 cards

   var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
   var ranks = ["2", "3", "4", "5", "6", 
                "7", "8", "9", "10", 
                "Jack", "Queen", "King", "Ace"];

   //loop through suits and ranks of cards array
   var cardCount = 0;
   for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 13; j++) {
         this.cards[cardCount] = new pokerCard(suits[i], ranks[j]);
         this.cards[cardCount].rankValue = j+2;//increment rank value by 2
         cardCount++;//increment
      }
   }
   
   // Method to randomly sort the deck half minus random number
   this.shuffle = function() {
      this.cards.sort(function() {
         return 0.5 - Math.random();
      });
   };
   
   // Method to deal cards from the deck into a poker hand
   this.dealTo = function(pokerHand) {//loop through cards array
      for (var i = 0; i < pokerHand.cards.length; i++) {
         pokerHand.cards[i] = this.cards.shift();//remove 1st element of array
      }
   };
}
/*       The pokerHand object contains an array of poker cards drawn from a
      poker deck. The methods associated with the object include the ability
      to calculate the value of the hand and to mark cards to be discarded,
      replaced with new cards from a poker deck.
 */
function pokerHand(handLength) {
   this.cards = new Array(handLength);
}

/* Return the highest ranked card in the hand */
pokerHand.prototype.highCard = function() {
   return Math.max.call(pokerHand, 
      this.cards[0].rankValue, 
      this.cards[1].rankValue,
      this.cards[2].rankValue,
      this.cards[3].rankValue,
      this.cards[4].rankValue);
};

/* Test for the presence of a flush */
pokerHand.prototype.hasFlush = function() {
   var firstSuit = this.cards[0].suit;   
   return this.cards.every(function(card) {
      return card.suit === firstSuit;
   });
};

/* Test for the presence of a straight */
pokerHand.prototype.hasStraight = function() {
   var cardArray = this.cards.map(function(card) {
      return card.rankValue;
   });
   cardArray.sort(function(a, b) {//sort array in order
      return a - b;
   });
   
   return cardArray.every(function(i, cards) {
      if (i > 0) {
         return (cards[i] - cards[i-1] === 1);
      } else {
         return true;
      }
   });   
};

/* Test for the presence of a straight flush by returning functions */
pokerHand.prototype.hasStraightFlush = function() {
   return this.hasFlush() && this.hasStraight();
};

/* Test for the presence of a royal flush by returning functions */
pokerHand.prototype.hasRoyalFlush = function() {
   return this.hasStraightFlush() && this.highCard() === 14;
};

/* Test for duplicates in the hand */
pokerHand.prototype.hasSets = function() {
   // object handSets summarizes the duplicates the hand
   var handSets = {};
   this.cards.forEach(function(card) {
     if (handSets.hasOwnProperty(card.rankValue)) {
       handSets[card.rankValue]++;
     } else {
       handSets[card.rankValue] = 1;
     }
   });

    var sets = "none";

   //loop through object
   for (var cardRank in handSets){
      if (handSets[cardRank] === 4) {sets = "Four of a Kind";}
      if (handSets[cardRank] === 3) {
         if (sets === "Pair") {sets = "Full House";}
         else {sets = "Three of a Kind";}
      }
      if (handSets[cardRank] === 2) {
         if (sets === "Three of a Kind") {sets = "Full House";}
         else if (sets === "Pair") {sets = "Two Pair";}
         else {sets = "Pair";}
      }
   }
   
   return sets;   
};

/* Returns the type of poker hand by calling functions*/
pokerHand.prototype.handType = function() {
   if (this.hasRoyalFlush()) {return "Royal Flush";}
   else if (this.hasStraightFlush()) {return "Straight Flush";}
   else if (this.hasFlush()) {return "Flush";}
   else if (this.hasStraight()) {return "Straight";}
   else {return this.hasSets();}
};

/* Returns the point total for each hand with decisions for values*/
pokerHand.prototype.handPoints = function() {
   switch (this.handType()) {//call
      case "Royal Flush" : return 30;
      case "Straight Flush" : return 30;
      case "Four of a Kind" : return 16;
      case "Full House" : return 10;
      case "Flush" : return 5;
      case "Straight" : return 12;
      case "Three of a Kind" : return 6;
      case "Two Pair" : return 3;
      case "Pair" : return 1;
      default: return 0;
   }
};
