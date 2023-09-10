const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const dialog = document.querySelector('#dialog');
const btnSi = document.querySelector('#btn-yes');
const btnNo = document.querySelector('#btn-no');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

const playerPosition = {
    x: undefined,
    y: undefined
}

const giftPosition = {
    x: undefined,
    y: undefined
}

let enemiesPositions = [];


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSize = canvasSize / 10;
    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';


    const map = maps[level];
    
    if (!map){
        gameWin();
        return;
    }
        
    const mapRows = map.trim().split('\n');
    const mapRowsToCols = mapRows.map(row => row.trim().split(''));


    game.clearRect(0,0,canvasSize,canvasSize);
    enemiesPositions = [];

    mapRowsToCols.forEach((row, rowI) =>{
        row.forEach((col, colI) =>{
           const emoji = emojis[col];

           const posX = elementsSize * (colI +1) + 14;
           const posY =elementsSize * (rowI +1) -10;

           if (col == 'O' && !playerPosition.x && !playerPosition.y){
               playerPosition.x  = posX;
               playerPosition.y = posY;
           }
           if (col == 'I'){
               giftPosition.x = posX;
               giftPosition.y = posY;
           }
           if (col == 'X'){
               enemiesPositions.push({
                   x: posX,
                   y: posY
               })
           }

           game.fillText(emoji, posX, posY)

        })
    })
    showLives();
    movePlayer();
}

function movePlayer() {
    const giftColliX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftColliY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftColli = giftColliX && giftColliY;

    if(giftColli){
        levelWin();
    }

    const player = emojis['PLAYER']
    game.fillText(player, playerPosition.x, playerPosition.y)


    const enemyColli = enemiesPositions.find(enemy => {
       const enemyColliX= enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
       const enemyColliY= enemy.y.toFixed(2) == playerPosition.y.toFixed(2);

       return enemyColliX && enemyColliY;
    })


    if (enemyColli) {
        game.fillText(emojis['BOMB_COLLISION'],enemyColli['x'],enemyColli['y']);
        gameFail();
    }


}




function levelWin() {
    level++;
    startGame();
}

function gameWin() {
    console.log('terminaste el juego')
}

function gameFail() {



    lives--;


    if (lives <= 0) {
        level = 0;
        lives = 3;
        dialog.style.display = 'block';
        btnSi.focus();
        if (  btnSi.addEventListener('click', () =>{
            dialog.style.display = 'none';
            startGame()
        })){

        }
        blockGame();

    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;


}

function showLives() {
   const heartsArray = Array(lives).fill( emojis['HEART'])

    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart))
}


window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


function moveByKeys(event) {
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown')  moveDown();
}

function moveUp() {
    if (playerPosition.y - elementsSize < 0) {

    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }

}

function moveLeft() {
    if (playerPosition.x - elementsSize < 50) {

    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    if (playerPosition.x + elementsSize -50 > canvasSize) {

    } else {
        playerPosition.x += elementsSize;
        startGame();
    }

}

function moveDown() {

    if (playerPosition.y + elementsSize - 50 > canvasSize) {

    } else {
        playerPosition.y += elementsSize;
        startGame();
    }

}

