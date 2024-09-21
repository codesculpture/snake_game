const GRID_SIZE = 12;

const changeCount = (n: number) => {
	document.getElementById("score").innerText = n;
}

const getSnakeCanvas = () => document.getElementById("snakeCanvas");

type Point = {
	x: number,
	y: number
}

type Snake = {
	points: Point[]
	length: number
}

const createCell = () => {
	const dom = document.createElement("div");
	return dom;
}

const fillSnakeCells = (snakeDOM) => {
	snakeDOM.innerHTML = "";
	for(let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		snakeDOM.appendChild(createCell())
	}
	applyAppleStyleForCell(snakeDOM, currentApplePoint)
}

const applyStyleForCell = (snakeCanvas, point: Point, isSnakeHead: bool) => {
	const pos = (point.y * GRID_SIZE) + point.x;
	if(isSnakeHead) {
	snakeCanvas.children[pos].setAttribute("class", "bg-black rounded-full w-[20px] h-[20px]")
	} else {
	snakeCanvas.children[pos].setAttribute("class", "bg-black w-[20px] h-[20px]")
	}
}

const applyAppleStyleForCell = (snakeCanvas, point: Point) => {
	const pos = (point.y * GRID_SIZE) + point.x;
	snakeCanvas.children[pos].setAttribute("class", "rounded-full bg-red-500 w-[20px] h-[20px]")
}


const drawSnake = (points: Point[], snakeCanvas) => {
	fillSnakeCells(snakeCanvas);
	for(let i = 0; i < points.length; i++) {
		applyStyleForCell(snakeCanvas, points[i], i === points.length - 1)
	}
}

const createSnakeDOM = (snake: Snake) => {
	const snakeCanvas = getSnakeCanvas();
	const { points } = snake;
	drawSnake(points, snakeCanvas);
}

const createSnake = (snake: Snake) => {	
	const snakeDOM = createSnakeDOM(snake);
}

const initSnake = () => {
	return {
		points: [
		{
			x: 0,
			y: 0
		},
		{
			x: 1,
			y: 0
		},
		],
	}
}
type CurrentDirection = "left" | "right" | "up" | "down";

let currentDirection: CurrentDirection = "right";

const addPoint = (points: Point[]) => {

}

const moveDown = (points: Point[]) => {
	if(currentDirection === "up") return;	
	for(let i = 0; i < points.length - 1; i++) {
		points[i] = {...points[i + 1] };
	}
	points[points.length - 1].y++
	const snakeCanvas = getSnakeCanvas();
	currentDirection = "down";
}

const moveUp = (points: Point[]) => {
	if(currentDirection === "down") return;
	for(let i = 0; i < points.length - 1; i++) {
		points[i] = {...points[i + 1] };
	}
	points[points.length - 1].y--
	const snakeCanvas = getSnakeCanvas();
	currentDirection = "up";
}

const moveLeft = (points: Point[]) => {
	if(currentDirection === "right") return;
	for(let i = 0; i < points.length - 1; i++) {
		points[i] = {...points[i + 1] };
	}
	points[points.length - 1].x--;
	const snakeCanvas = getSnakeCanvas();
	currentDirection = "left";
}

const moveRight = (points: Point[]) => {
	if(currentDirection === "left") return;
	for(let i = 0; i < points.length - 1; i++) {
		points[i] = {...points[i + 1] };
	}
	points[points.length - 1].x++
	const snakeCanvas = getSnakeCanvas();
	currentDirection = "right";
}


const isSamePoint = (a: Point, b: Point) => {
	return a.x === b.x && a.y === b.y;
}

const initControls = (points: Point[]) => {
	const controlHandler = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
      	moveDown(points);
        break;
      case "ArrowUp":
      	moveUp(points);
        break;
      case "ArrowLeft":
      	moveLeft(points);
        break;
      case "ArrowRight":
      	moveRight(points);
        break;
      default:
        break;
    }

    const headPoint = points.at(-1);

    let isCrashed = false;
    for(let i = 0; i < points.length - 1; i++) {
    	isCrashed = isSamePoint(points[i], headPoint);
    	if(isCrashed) {
    		alert("You Made a mistake !!");
    		resetGame();
    		return;
    	};
    }
    if(isSamePoint(headPoint, currentApplePoint)) {
    	const firsPoint = points[0];
    	points.unshift({
    		x: firsPoint.x - 1,
    		y: firsPoint.y
    	});
    	updateScore();
    	createRandomApple(points);
    }
	drawSnake(points, snakeCanvas);
    event.preventDefault();
  };
  currentControlHandler = controlHandler;
		window.addEventListener(
  "keydown",
  controlHandler,
  true,
);
}

const generateRandomPoint = (): Point => {
	const x = Math.floor(Math.random() * GRID_SIZE);
	const y = Math.floor(Math.random() * GRID_SIZE);
	return { x, y}
}

let currentApplePoint = null;
let currentScore = null;
let currentSnake = null;
let currentControlHandler = null;

const createRandomApple = (points: Point[]) => {
	const snakeCanvas = getSnakeCanvas();
	let generatedPoint = null;

	while(!generatedPoint || points.find((point) => isSamePoint(point, generatedPoint))) {
		generatedPoint = generateRandomPoint();
	}
	currentApplePoint = generatedPoint;
}

const updateScore = () => {
	const scoreDOM = document.getElementById("score");
	currentScore++
	scoreDOM.innerText = currentScore;
}

const initGame = () => {
	currentSnake = initSnake();
	createRandomApple(currentSnake.points);
	createSnake(currentSnake);
	initControls(currentSnake.points);
	currentScore = -1;
	updateScore();
	currentDirection = "right";
}

const resetGame = () => {
	window.removeEventListener("keydown", currentControlHandler, true);
	initGame();
}

initGame();

