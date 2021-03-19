var area = document.getElementById("canvas");
var ctx = area.getContext("2d");
ctx.moveTo(0, 0);
var pixelSize = 30;

if (localStorage.getItem("points") == null)
    localStorage.setItem("points", 0)
document.getElementById("highscore").innerHTML = "Highscore: " + localStorage.getItem("points")


function gcd_two_numbers(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function resizeCanvas() {
    var pixelRatio = 2;;
    if (window.innerHeight > window.innerWidth) {
        var width = window.innerWidth;
    }
    else {
        var width = window.innerHeight;
    }
    var height = width * (window.innerHeight / window.innerWidth);
    area.width = width * pixelRatio;
    area.height = height * pixelRatio;
    gameWidth = area.width;
    gameHeight = area.height;
    pixelSize = gcd_two_numbers(gameHeight, gameWidth) * 15
    try { moveEgg(); } catch (e) { }
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
var rendersPerTick = 5;
var renderCount = 0;


var stopped = true;
var points = 0;
var snake = { x: getPixelCompatibleCoords(gameWidth), y: getPixelCompatibleCoords(gameHeight), length: 1, positions: [] };
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

function checkOutsideBounds({ x, y }) {
    if (y + pixelSize > gameHeight || y < 0 || x + pixelSize > gameWidth || x < 0)
        return true;
    return false;
}

function die() {
    if (document.getElementById("menu").style.display == "none") {
        stopped = true;
        toggleMenu();
    }
    if (localStorage.getItem("points") < points)
        localStorage.setItem("points", points)
    document.getElementById("highscore").innerHTML = "Highscore: " + localStorage.getItem("points")
}

function moveEgg() {
    egg.x = getPixelCompatibleCoords(getRandomInt(gameWidth))
    egg.y = getPixelCompatibleCoords(getRandomInt(gameHeight))
    if (checkOutsideBounds(egg))
        moveEgg();
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
        moveEgg();
    }
    if (snake.positions.length > snake.length)
        snake.positions.shift();
    if (checkOutsideBounds(snake))
        die();
}

function render() {
    ctx.clearRect(0, 0, area.width, area.height);
    drawEgg();
    drawSnake(snake);
}


try {
    var renderTimer = setInterval(render, 3);
    var gameTimer = setInterval(main, 100 - (snake.length * 5));

} catch (e) { console.log(e); }