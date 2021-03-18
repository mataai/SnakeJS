var area = document.getElementById("canvas");
var ctx = area.getContext("2d");
ctx.moveTo(0, 0);
function resizeCanvas() {
    console.log("resize");
    //Gets the devicePixelRatio
    var pixelRatio = window.devicePixelRatio * 2;
    console.log(pixelRatio);
    //The viewport is in portrait mode, so var width should be based off viewport WIDTH
    if (window.innerHeight > window.innerWidth) {
        //Makes the canvas 100% of the viewport width
        var width = window.innerWidth;
    }
    //The viewport is in landscape mode, so var width should be based off viewport HEIGHT
    else {
        //Makes the canvas 100% of the viewport height
        var width = window.innerHeight;
    }

    //This is done in order to maintain the 1:1 aspect ratio, adjust as needed
    var height = width * (window.innerHeight / window.innerWidth);
    area.width = width * pixelRatio;
    area.height = height * pixelRatio;
    gameWidth = area.width;
    gameHeight = area.height;
}
window.addEventListener('resize', () => {
    resizeCanvas()
})
resizeCanvas();
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, area.width, area.height);

var directions = { "LEFT": "LEFT", "UP": "UP", "RIGHT": "RIGHT", "BOTTOM": "BOTTOM" };
var lastdirection = directions.UP;


var oneChangePerTick = false;
var pixelSize = 30;
var rendersPerTick = 5;
var renderCount = 0;



var stopped = true;
var points = 0;
var snake = { x: getPixelCompatibleCoords(gameWidth / 2), y: getPixelCompatibleCoords(gameHeight / 2), length: 1, positions: [] };
var egg = { x: getPixelCompatibleCoords(getRandomInt(gameWidth)), y: getPixelCompatibleCoords(getRandomInt(gameHeight)) }

function getRandomInt(max) { return Math.random() * Math.floor(max); }

function getPixelCompatibleCoords(value) {
    return Math.ceil(value / pixelSize) * pixelSize
}

document.addEventListener('keydown', function (event) {
    if (!oneChangePerTick)
        switch (event.key) {
            case "ArrowDown":
            case "s":
                if (lastdirection != directions.UP)
                    lastdirection = directions.BOTTOM;
                break;
            case "ArrowUp":
            case "w":
                if (lastdirection != directions.BOTTOM)
                    lastdirection = directions.UP;
                break;
            case "ArrowRight":
            case "d":
                if (lastdirection != directions.LEFT)
                    lastdirection = directions.RIGHT;
                break;
            case "ArrowLeft":
            case "a":
                if (lastdirection != directions.RIGHT)
                    lastdirection = directions.LEFT;
                break;
            case "Escape":
                die()
                break;

            default:
                console.log(event.key);
                break;
        }
    oneChangePerTick = true;
});

document.getElementById("playbutton").onclick = () => {
    stopped = false;
    reset();
    toggleMenu();

}

function toggleMenu() {
    document.getElementById("points").innerHTML = points + " points"
    if (document.getElementById("menu").style.display == "none") {
        document.getElementById("menu").style.display = "grid";
    } else {
        document.getElementById("menu").style.display = "none";
    }
}

function reset() {
    points = 0;
    snake = { x: getPixelCompatibleCoords(gameWidth / 2), y: getPixelCompatibleCoords(gameHeight / 2), length: 1, positions: [] };
    egg = { x: getPixelCompatibleCoords(getRandomInt(gameWidth)), y: getPixelCompatibleCoords(getRandomInt(gameHeight)) }
}

function die() {
    if (document.getElementById("menu").style.display == "none") {
        stopped = true;
        toggleMenu();
    }
}

function drawEgg() {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.fillRect(egg.x, egg.y, pixelSize, pixelSize);
}

function drawSnake(_snake) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect(_snake.x, _snake.y, pixelSize, pixelSize);
    for (key of _snake.positions) {
        if (_snake.length > 4 && key.y == _snake.y && key.x == _snake.x) {
            die();
        }
        ctx.fillRect(key.x, key.y, pixelSize, pixelSize)
    }
}

function main() {
    oneChangePerTick = false;
    if (stopped)
        return;
    ctx.clearRect(0, 0, area.width, area.height);
    snake.positions.push({ x: snake.x, y: snake.y })
    switch (lastdirection) {
        case directions.BOTTOM:
            snake.y += pixelSize;
            break;
        case directions.UP:
            snake.y -= pixelSize;
            break;
        case directions.RIGHT:
            snake.x += pixelSize;
            break;
        case directions.LEFT:
            snake.x -= pixelSize;
            break;
    }
    //render();
    if (snake.x == egg.x && snake.y == egg.y) {
        points += 1;
        snake.length += 1;
        document.getElementById("score").innerHTML = "Points: " + points
        egg.x = getPixelCompatibleCoords(getRandomInt(gameWidth))
        egg.y = getPixelCompatibleCoords(getRandomInt(gameHeight))
    }
    if (snake.positions.length > snake.length)
        snake.positions.shift();
    if (snake.y > gameHeight || (snake.y) < 0 || (snake.x) > gameWidth || (snake.x) < 0)
        die();
}

function render() {
    console.log("render");
    drawEgg();
    drawSnake(snake);
}


try {

    var renderTimer = setInterval(render, 5);
    var gameTimer = setInterval(main, 100 - (snake.length * 5));

} catch (e) { console.log(e); }