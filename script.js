// script.js

let balance = 1000;  // Starting balance for the player
let betAmount = 0;
let currentMultiplier = 1.0;
let gameInterval;
let gameInProgress = false;
let betPlaced = false;
let roundHistory = []; // To keep track of round results

// Get HTML elements
const multiplierDisplay = document.getElementById('multiplier');
const placeBetButton = document.getElementById('placeBetButton');
const cashoutButton = document.getElementById('cashoutButton');
const betAmountInput = document.getElementById('betAmount');
const statusMessage = document.getElementById('statusMessage');
const resultMessage = document.getElementById('resultMessage');
const balanceDisplay = document.getElementById('balance');
const roundHistoryDisplay = document.getElementById('roundHistory');
const planeEmoji = document.getElementById('planeEmoji');

// Audio elements
const planeFlyingSound = document.getElementById('planeFlyingSound');
const gameCrashSound = document.getElementById('gameCrashSound');
const cashoutSound = document.getElementById('cashoutSound');

// Update the player's balance on the page
function updateBalance() {
    balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

// Update round history display
function updateRoundHistory() {
    const historyList = document.getElementById('roundHistory');
    historyList.innerHTML = '';  // Clear previous history

    roundHistory.forEach((round, index) => {
        const roundElement = document.createElement('li');
        roundElement.textContent = `Round ${index + 1}: Crash at ${round.multiplier}x - You ${round.result}`;
        historyList.appendChild(roundElement);
    });
}

// Handle place bet
placeBetButton.addEventListener('click', () => {
    const betInput = parseFloat(betAmountInput.value);

    if (isNaN(betInput) || betInput <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }

    if (betInput > balance) {
        alert('You don\'t have enough balance!');
        return;
    }

    // Deduct bet amount from the player's balance
    betAmount = betInput;
    balance -= betAmount;
    betPlaced = true;
    gameInProgress = true;
    currentMultiplier = 1.0;

    // Disable the place bet button and enable cashout
    placeBetButton.disabled = true;
    cashoutButton.disabled = false;

    // Start the multiplier growth
    statusMessage.textContent = 'Game in progress...';

    // Play plane flying sound
    planeFlyingSound.play();

    // Random crash multiplier between 1.5x and 10x
    const crashMultiplier = (Math.random() * (10 - 1.5) + 1.5).toFixed(2);

    // Plane flying animation logic
    let planeLeftPosition = -100; // Start the plane off-screen
    let planeSpeed = 1; // Plane's speed (based on the multiplier)
    
    gameInterval = setInterval(() => {
        if (gameInProgress) {
            currentMultiplier += 0.01; // Increment the multiplier
            multiplierDisplay.textContent = currentMultiplier.toFixed(2);

            // Move the plane based on multiplier
            planeSpeed = 2 + currentMultiplier / 10; // Plane moves faster with higher multiplier
            planeLeftPosition += planeSpeed; // Move plane to the right

            // Update plane position
            planeEmoji.style.left = planeLeftPosition + "px";

            // Simulate the game crash
            if (currentMultiplier >= crashMultiplier) {
                gameInProgress = false;
                clearInterval(gameInterval);

                // Play the crash sound
                gameCrashSound.play();

                // Record round result
                const result = `lost`;
                roundHistory.push({ multiplier: crashMultiplier, result });
                updateRoundHistory();

                statusMessage.textContent = `Game crashed at ${crashMultiplier}x! You lost your bet.`;
                resultMessage.textContent = `You lost: $${betAmount.toFixed(2)}`;

                // Reset game state
                betAmount = 0;
                betPlaced = false;
                placeBetButton.disabled = false;
                cashoutButton.disabled = true;
                updateBalance();
            }
        }
    }, 50);  // Speed of multiplier increase
});

// Handle cashout
cashoutButton.addEventListener('click', () => {
    if (!betPlaced) return;

    gameInProgress = false;
    clearInterval(gameInterval);

    // Calculate winnings
    const winnings = betAmount * currentMultiplier;

    // Play the cashout sound
    cashoutSound.play();

    // Record round result
    const result = `won $${winnings.toFixed(2)}`;
    roundHistory.push({ multiplier: currentMultiplier.toFixed(2), result });
    updateRoundHistory();

    statusMessage.textContent = `You cashed out at ${currentMultiplier.toFixed(2)}x!`;
    resultMessage.textContent = `You won: $${winnings.toFixed(2)}`;

    // Update balance
    balance += winnings;

    // Reset game state
    betAmount = 0;
    betPlaced = false;
    placeBetButton.disabled = false;
    cashoutButton.disabled = true;
    updateBalance();
});

// Initial balance update
updateBalance();
