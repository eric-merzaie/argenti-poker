// node file system
const fs = require('fs');

// read .txt file
let rawFile = fs.readFileSync('poker-hands.txt').toString().split("\n");

// order strongest card faces
const order = "23456789TJQKA"

// initialise win counters
let playerOneWins = 0;
let playerTwoWins = 0;

// loop through by round
for (let round of rawFile) {
    // split rounds into player 1 and player 2
    let hand = round.split(" ");
    let playerOne = [hand[0], hand[1], hand[2], hand[3], hand[4]].join(" ");
    let playerTwo = [hand[5], hand[6], hand[7], hand[8], hand[9]].join(" ");

    // execute match function
    match(playerOne, playerTwo);
}

// console log final win counts
console.log("Player 1 wins: " + playerOneWins);
console.log("Player 2 wins: " + playerTwoWins);






/*===================================================================
----------------------------- Functions -----------------------------
=====================================================================*/

function match(h1, h2) { 
    if (compareHands(h1, h2) == "Player 1 Wins") {
        playerOneWins += 1;
    } else if (compareHands(h1, h2) == "Player 2 Wins") {
        playerTwoWins += 1;

    }
}

function compareHands(h1, h2) {
    let d1 = getHandDetails(h1)
    let d2 = getHandDetails(h2)
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {
            return "Player 1 Wins"
        } else if (d1.value > d2.value) {
            return "Player 2 Wins"
        } else {
            return "It's a draw"
        }
    }
    return d1.rank < d2.rank ? "Player 1 Wins" : "Player 2 Wins"
}

function getHandDetails(hand) {
    const cards = hand.split(" ")
    const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a[0])])).sort()
    const suits = cards.map(a => a[1]).sort()
    const counts = faces.reduce(count, {})
    const duplicates = Object.values(counts).reduce(count, {})
    const flush = suits[0] === suits[4]
    const first = faces[0].charCodeAt(0)
    const straight = faces.every((f, index) => f.charCodeAt(0) - first === index)
    let rank =
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9

    return { rank, value: faces.sort(byCountFirst).join("") }

    function byCountFirst(a, b) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a]
        if (countDiff) return countDiff // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1
    }

    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}