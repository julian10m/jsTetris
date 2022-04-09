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

const getStartingPosition = (tetromino) =>
  -Math.floor(Math.max(...tetromino) / width) * width;

const getRandomCharacteristics = () => [
  Math.floor(Math.random() * tetrominoes.length),
  Math.floor(Math.random() * tetrominoes[0].length),
];

const getTetromino = (tetrominoes, shapeIdx, rotationIdx) =>
  tetrominoes[shapeIdx][rotationIdx];

const shouldAlreadyBeVisible = (index) => index >= 0;

const draw = function (tetromino, squares) {
  tetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index))
      squares[index].classList.add("tetromino");
  });
};

const cannotBeDisplayed = (tetromino) =>
  tetromino.some(
    (index) =>
      shouldAlreadyBeVisible(index) &&
      (index >= squares.length || squares[index].classList.contains("taken"))
  );

const createNewTetromino = function (tetrominoes) {
  const [currentShape, currentRotation] = getRandomCharacteristics();
  let currentTetromino = getTetromino(
    tetrominoes,
    currentShape,
    currentRotation
  );
  const startingPosition = getStartingPosition(currentTetromino);
  currentTetromino = currentTetromino.map((index) => index + startingPosition);
  console.log(currentTetromino);
  return [currentShape, currentRotation, currentTetromino];
};

const clearTimer = function () {
  clearInterval(timerId);
  timerId = null;
};

const markGrid = function (tetromino) {
  tetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index)) squares[index].classList.add("taken");
  });
};

const render = function (step) {
  if (!cannotBeDisplayed(currentTetromino)) draw(currentTetromino, squares);
  else {
    currentTetromino = currentTetromino.map((index) => index - step);
    draw(currentTetromino, squares);
    markGrid(currentTetromino);
    if (currentTetromino.some((index) => index < 0)) {
      console.log("turning off timer");
      isFinished = true;
      clearTimer();
    } else {
      [currentShape, currentRotation, currentTetromino] =
        createNewTetromino(tetrominoes);
      render(0);
    }
  }
};

const undraw = function (tetromino, squares) {
  tetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index))
      squares[index].classList.remove("tetromino");
  });
};

const move = function (step) {
  undraw(currentTetromino, squares);
  currentTetromino = currentTetromino.map((index) => index + step);
  render(step);
};

const moveDown = function () {
  move(width);
};

const isAtEdge = (tetromino, edgeIdx) =>
  tetromino.some((index) => index % width === edgeIdx);

const hasTetrominoAtSide = (tetromino, deltaSide) =>
  tetromino.some(
    (index) =>
      shouldAlreadyBeVisible(index) &&
      squares[index + deltaSide].classList.contains("taken")
  );

const moveSide = function (edgeIdx, deltaSide) {
  if (
    !isAtEdge(currentTetromino, edgeIdx) &&
    !hasTetrominoAtSide(currentTetromino, deltaSide)
  ) {
    move(deltaSide);
  }
};

const moveLeft = () => moveSide(0, -1);
const moveRight = () => moveSide(width - 1, 1);

const rotate = function () {
  let nextRotation = currentRotation + 1;
  if (nextRotation === tetrominoes[currentShape].length) nextRotation = 0;
  const nextTetromino = tetrominoes[currentShape][nextRotation];
  if (
    !(
      (isAtEdge(nextTetromino, 0) && isAtEdge(nextTetromino, width - 1)) ||
      cannotBeDisplayed(nextTetromino)
    )
  ) {
    undraw(currentTetromino, squares);
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
const squares = Array.from(document.querySelectorAll(".grid div"));
const width = 10;

const miniGridSquares = Array.from(document.querySelectorAll(".mini-grid div"));
const miniGridWidth = 8;
let miniGridIndex = 1;

const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
const tetrominoes = getTetrominoes(width);

let isFinished = false;

let [currentShape, currentRotation, currentTetromino] =
  createNewTetromino(tetrominoes);
render(0);

let timerId = setInterval(moveDown, 1000);
document.addEventListener("keydown", applyTransformation);

startBtn.addEventListener("click", function () {
  if (!timerId) timerId = setInterval(moveDown, 500);
  else clearTimer();
});
