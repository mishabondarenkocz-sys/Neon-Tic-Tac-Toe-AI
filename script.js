const modeScreen = document.getElementById('mode-screen');
const gameScreen = document.getElementById('game-screen');
const statusText = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const winningLine = document.getElementById('winning-line');

let gameMode = 'friend'; 
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикали
    [0, 4, 8], [2, 4, 6]             // Диагонали
];

document.getElementById('btn-vs-ai').addEventListener('click', () => startNewGame('ai'));
document.getElementById('btn-vs-friend').addEventListener('click', () => startNewGame('friend'));
document.getElementById('menu-btn').addEventListener('click', showMenu);
document.getElementById('restart-btn').addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function startNewGame(mode) {
    gameMode = mode;
    modeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame();
}

function showMenu() {
    modeScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !isGameActive) return;

    makeMove(clickedCellIndex, currentPlayer);

    if (!isGameActive) return;

    if (gameMode === 'ai' && isGameActive) {
        isGameActive = false; 
        statusText.innerHTML = `Бот думает... 🤖`;
        setTimeout(makeAiMove, 400); 
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
    
    checkResult();
}

function makeAiMove() {
    let targetIndex = -1;
    targetIndex = findWinningIndex('O');
    if (targetIndex === -1) targetIndex = findWinningIndex('X');
    if (targetIndex === -1 && gameState[4] === "") targetIndex = 4;

    if (targetIndex === -1) {
        const emptyCells = [];
        gameState.forEach((val, idx) => { if (val === "") emptyCells.push(idx); });
        targetIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    isGameActive = true; 
    if (targetIndex !== undefined && targetIndex !== -1) {
        makeMove(targetIndex, 'O');
    }
}

function findWinningIndex(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const vals = [gameState[a], gameState[b], gameState[c]];
        if (vals.filter(v => v === player).length === 2 && vals.includes("")) {
            if (gameState[a] === "") return a;
            if (gameState[b] === "") return b;
            if (gameState[c] === "") return c;
        }
    }
    return -1;
}

function checkResult() {
    let roundWon = false;
    let winComboIndex = -1;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            winComboIndex = i;
            break;
        }
    }

    if (roundWon) {
        // МГНОВЕННО РИСУЕМ ЛИНИЮ В ЦВЕТ ТЕКУЩЕГО ПОБЕДИТЕЛЯ
        drawWinningLine(winComboIndex, currentPlayer.toLowerCase()); 
        
        statusText.innerHTML = `Победил игрок: <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>! 🎉`;
        isGameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.innerHTML = `Ничья! 🤝`;
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    
    if (gameMode === 'friend') {
        statusText.innerHTML = `Ход игрока: <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>`;
    } else {
        statusText.innerHTML = `Ваш ход! 😎`;
        currentPlayer = 'X'; 
    }
}

function drawWinningLine(comboIndex, winner) {
    winningLine.classList.remove('hidden');
    winningLine.classList.add(`${winner}-win`);

    const lineStyles = [
        { top: '46px', left: '15px', transform: 'rotate(0deg)', width: '310px' },   
        { top: '158px', left: '15px', transform: 'rotate(0deg)', width: '310px' },  
        { top: '270px', left: '15px', transform: 'rotate(0deg)', width: '310px' },  
        { top: '15px', left: '46px', transform: 'rotate(90deg)', width: '310px' },  
        { top: '15px', left: '158px', transform: 'rotate(90deg)', width: '310px' }, 
        { top: '15px', left: '270px', transform: 'rotate(90deg)', width: '310px' }, 
        { top: '20px', left: '20px', transform: 'rotate(45deg)', width: '420px' },  
        { top: '20px', left: '320px', transform: 'rotate(135deg)', width: '420px' } 
    ];

    const style = lineStyles[comboIndex];
    winningLine.style.top = style.top;
    winningLine.style.left = style.left;
    winningLine.style.transform = style.transform;

    setTimeout(() => {
        winningLine.style.width = style.width;
    }, 50);
}

function resetGame() {
    isGameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.innerHTML = gameMode === 'friend' ? `Ход игрока: <span class="player-x">X</span>` : `Ваш ход! 😎`;
    
    winningLine.classList.add('hidden');
    winningLine.className = 'winning-line hidden';
    winningLine.style.width = '0';

    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });
}
