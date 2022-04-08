const getTetrominoes = function () {
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
  ];
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  return [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
};

const getStartingPosition = (tetromino) => -Math.max(tetromino) - width;

const getRandomCharacteristics = () => [
  Math.floor(Math.random() * tetrominoes.length),
  Math.floor(Math.random() * tetrominoes[0].length),
];

const getTetromino = (shapeIdx, rotationIdx) =>
  tetrominoes[shapeIdx][rotationIdx];

const freeze = function () {
  if (
    currentTetromino.some(
      (index) =>
        currentPosition + index + width >= squares.length ||
        squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    console.log("Freezeing now");
    currentTetromino.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    if (currentTetromino.some((index) => currentPosition + index < width)) {
      console.log("turning off timer");
      isFinished = true;
      clearInterval(timerId);
      timerId = null;
    } else {
      [currentShape, currentRotation] = getRandomCharacteristics();
      currentTetromino = getTetromino(currentShape, currentRotation);
      currentPosition = 4 + getStartingPosition(...currentTetromino);
      draw();
    }
  }
};

const draw = function () {
  currentTetromino.forEach((index) => {
    if (currentPosition + index >= 0)
      squares[currentPosition + index].classList.add("tetromino");
  });
};

const undraw = function () {
  currentTetromino.forEach((index) => {
    if (currentPosition + index >= 0)
      squares[currentPosition + index].classList.remove("tetromino");
  });
};

const move = function (step) {
  freeze();
  undraw();
  currentPosition += step;
  draw();
};

const moveDown = function () {
  move(width);
};

const isAtLeftEdge = function (tetromino) {
  return tetromino.some((index) => (currentPosition + index) % width === 0);
};

const hasTetrominoAtLeft = function (tetromino) {
  return tetromino.some((index) =>
    squares[index + currentPosition - 1].classList.contains("taken")
  );
};

const moveLeft = function () {
  if (currentPosition < 0) return;
  if (
    !isAtLeftEdge(currentTetromino) &&
    !hasTetrominoAtLeft(currentTetromino)
  ) {
    move(-1);
  }
};

const isAtRightEdge = function (tetromino) {
  return tetromino.some(
    (index) => (currentPosition + index) % width === width - 1
  );
};

const hasTetrominoAtRight = function (tetromino) {
  return tetromino.some((index) =>
    squares[index + currentPosition + 1].classList.contains("taken")
  );
};

const moveRight = function () {
  if (currentPosition < 0) return;
  if (
    !isAtRightEdge(currentTetromino) &&
    !hasTetrominoAtRight(currentTetromino)
  ) {
    move(1);
  }
};

const isInvalidRotation = function (tetromino) {
  return (
    (isAtLeftEdge(tetromino) && isAtRightEdge(tetromino)) ||
    (currentPosition >= 0 &&
      tetromino.some(
        (index) =>
          currentPosition + index >= squares.length ||
          squares[currentPosition + index].classList.contains("taken")
      ))
  );
};

const rotate = function () {
  console.log("rotate");
  let nextRotation = currentRotation + 1;
  if (nextRotation === tetrominoes[currentShape].length) nextRotation = 0;
  const nextTetromino = tetrominoes[currentShape][nextRotation];
  if (!isInvalidRotation(nextTetromino)) {
    undraw();
    currentRotation = nextRotation;
    currentTetromino = nextTetromino;
    move(0);
  }
};

const applyTransformation = function (e) {
  if (!isFinished) {
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
  }
};

const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
const width = 10;
const tetrominoes = getTetrominoes();

let isFinished = false;
let [currentShape, currentRotation] = getRandomCharacteristics();
let currentTetromino = getTetromino(currentShape, currentRotation);
let currentPosition = 4 + getStartingPosition(...currentTetromino);
let timerId = setInterval(moveDown, 500);
document.addEventListener("keyup", applyTransformation);
startBtn.addEventListener("click", function () {
  if (!timerId) timerId = setInterval(moveDown, 500);
  else {
    clearInterval(timerId);
    timerId = null;
  }
});
