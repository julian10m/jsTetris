const getTetrominoes = function (width) {
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

const getStartingPosition = (tetromino, width) =>
  -Math.ceil(Math.max(...tetromino) / width) * width;

const getRandomCharacteristics = (tetrominoes) => [
  Math.floor(Math.random() * tetrominoes.length),
  Math.floor(Math.random() * tetrominoes[0].length),
];

const getTetromino = (tetrominoes, shapeIdx, rotationIdx) =>
  tetrominoes[shapeIdx][rotationIdx];

const absoluteIndex = (currentPosition, index) => currentPosition + index;

const shouldAlreadyBeVisible = (currentPosition, index) =>
  absoluteIndex(currentPosition, index) >= 0;

const draw = function (currentPosition, tetromino, squares) {
  tetromino.forEach((index) => {
    shouldAlreadyBeVisible(currentPosition, index) &&
      squares[absoluteIndex(currentPosition, index)].classList.add("tetromino");
  });
};

const isNotValidPosition = (currentPosition, tetromino, squares) =>
  tetromino.some(
    (index) =>
      absoluteIndex(currentPosition, index) >= squares.length ||
      (shouldAlreadyBeVisible(currentPosition, index) &&
        squares[absoluteIndex(currentPosition, index)].classList.contains(
          "taken"
        ))
  );

const createNewTetromino = function (tetrominoes, width) {
  const [currentShape, currentRotation] = getRandomCharacteristics(tetrominoes);
  const currentTetromino = getTetromino(
    tetrominoes,
    currentShape,
    currentRotation
  );
  const currentPosition = getStartingPosition(currentTetromino, width);
  return [currentShape, currentRotation, currentTetromino, currentPosition];
};

const clearTimer = function () {
  clearInterval(timerId);
  timerId = null;
};

const markGrid = function (currentPosition, tetromino, squares) {
  tetromino.forEach((index) => {
    shouldAlreadyBeVisible(currentPosition, index) &&
      squares[absoluteIndex(currentPosition, index)].classList.add("taken");
  });
};

const render = function (step) {
  if (!isNotValidPosition(currentPosition, currentTetromino, squares))
    draw(currentPosition, currentTetromino, squares);
  else {
    currentPosition -= step;
    draw(currentPosition, currentTetromino, squares);
    markGrid(currentPosition, currentTetromino, squares);
    if (
      currentTetromino.some(
        (index) => absoluteIndex(currentPosition, index) < 0
      )
    ) {
      console.log("turning off timer");
      isFinished = true;
      clearTimer();
    } else {
      [currentShape, currentRotation, currentTetromino, currentPosition] =
        createNewTetromino(tetrominoes, width);
      render(0);
    }
  }
};

const undraw = function (currentPosition, tetromino, squares) {
  tetromino.forEach((index) => {
    shouldAlreadyBeVisible(currentPosition, index) &&
      squares[absoluteIndex(currentPosition, index)].classList.remove(
        "tetromino"
      );
  });
};

const move = function (step) {
  undraw(currentPosition, currentTetromino, squares);
  currentPosition += step;
  render(step);
};

const moveDown = function () {
  move(width);
};

const isAtEdge = (tetromino, width, edgeIdx) =>
  tetromino.some(
    (index) =>
      ((absoluteIndex(currentPosition, index) % width) + width) % width ===
      edgeIdx
  );

const hasTetrominoAtSide = (tetromino, deltaSide) =>
  tetromino.some(
    (index) =>
      shouldAlreadyBeVisible(currentPosition, index) &&
      squares[
        absoluteIndex(currentPosition, index) + deltaSide
      ].classList.contains("taken")
  );

const moveSide = function (edgeIdx, deltaSide) {
  if (
    isAtEdge(currentTetromino, width, edgeIdx) ||
    hasTetrominoAtSide(currentTetromino, deltaSide)
  )
    return;
  move(deltaSide);
};

const moveLeft = () => moveSide(0, -1);
const moveRight = () => moveSide(width - 1, 1);

const rotate = function () {
  let nextRotation = currentRotation + 1;
  if (nextRotation === tetrominoes[currentShape].length) nextRotation = 0;
  const nextTetromino = tetrominoes[currentShape][nextRotation];
  if (
    isNotValidPosition(currentPosition, nextTetromino, squares) ||
    (isAtEdge(nextTetromino, width, 0) &&
      isAtEdge(nextTetromino, width, width - 1))
  )
    return;
  undraw(currentPosition, currentTetromino, squares);
  currentRotation = nextRotation;
  currentTetromino = nextTetromino;
  move(0);
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
const squares = Array.from(document.querySelectorAll(".grid div"));
const width = 10;

const miniGridSquares = Array.from(document.querySelectorAll(".mini-grid div"));
const miniGridWidth = 8;
let miniGridIndex = 1;

const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
const tetrominoes = getTetrominoes(width);

let isFinished = false;

let [currentShape, currentRotation, currentTetromino, currentPosition] =
  createNewTetromino(tetrominoes, width);
render(0);

let timerId = setInterval(moveDown, 1000);
document.addEventListener("keydown", applyTransformation);

startBtn.addEventListener("click", function () {
  if (!timerId) timerId = setInterval(moveDown, 500);
  else clearTimer();
});
