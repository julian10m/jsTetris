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

// const freeze = function () {
//   if (
//     currentTetromino.some(
//       (index) =>
//         currentPosition + index + width >= squares.length ||
//         squares[currentPosition + index + width].classList.contains("taken")
//     )
//   ) {
//     console.log("Freezeing now");
//     currentTetromino.forEach((index) =>
//       squares[currentPosition + index].classList.add("taken")
//     );
//     if (currentTetromino.some((index) => currentPosition + index < width)) {
//       console.log("turning off timer");
//       isFinished = true;
//       clearInterval(timerId);
//       timerId = null;
//     } else {
//       [currentShape, currentRotation] = getRandomCharacteristics();
//       currentTetromino = getTetromino(currentShape, currentRotation);
//       currentPosition = 4 + getStartingPosition(...currentTetromino);
//       draw();
//     }
//   }
// };

const shouldAlreadyBeVisible = (index) => currentPosition + index >= 0;

const draw = function () {
  currentTetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index))
      squares[currentPosition + index].classList.add("tetromino");
  });
};

const cannotBeDisplayedAtCurrentPosition = (tetromino) =>
  tetromino.some(
    (index) =>
      shouldAlreadyBeVisible(index) &&
      (currentPosition + index >= squares.length ||
        squares[currentPosition + index].classList.contains("taken"))
  );

const loadAndRenderNewTetromino = function () {
  [currentShape, currentRotation] = getRandomCharacteristics();
  currentTetromino = getTetromino(currentShape, currentRotation);
  currentPosition = 4 + getStartingPosition(...currentTetromino);
  render(0);
};

const clearTimer = function () {
  clearInterval(timerId);
  timerId = null;
};

const markGrid = function (tetromino) {
  tetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index))
      squares[currentPosition + index].classList.add("taken");
  });
};

const render = function (step) {
  if (!cannotBeDisplayedAtCurrentPosition(currentTetromino)) draw();
  else {
    currentPosition -= step;
    draw();
    markGrid(currentTetromino);
    if (currentTetromino.some((index) => currentPosition + index < 0)) {
      console.log("turning off timer");
      isFinished = true;
      clearTimer();
    } else {
      loadAndRenderNewTetromino();
    }
  }
};

const undraw = function () {
  currentTetromino.forEach((index) => {
    if (shouldAlreadyBeVisible(index))
      squares[currentPosition + index].classList.remove("tetromino");
  });
};

const move = function (step) {
  //   freeze();
  undraw();
  currentPosition += step;
  render(step);
};

const moveDown = function () {
  move(width);
};

const isAtEdge = (tetromino, edgeIdx) =>
  tetromino.some((index) => (currentPosition + index) % width === edgeIdx);
// const isAtLeftEdge = (tetromino) => isAtEdge(tetromino, 0);
// const isAtRightEdge = (tetromino) => isAtEdge(tetromino, width - 1);

const hasTetrominoAtSide = (tetromino, deltaSide) =>
  tetromino.some((index) =>
    squares[index + currentPosition + deltaSide].classList.contains("taken")
  );
// const hasTetrominoAtLeft = (tetromino) => hasTetrominoAtSide(tetromino, -1);
// const hasTetrominoAtRight = (tetromino) => hasTetrominoAtSide(tetromino, 1);

const moveSide = function (edgeIdx, deltaSide) {
  if (currentPosition < 0) return;
  if (
    !isAtEdge(currentTetromino, edgeIdx) &&
    !hasTetrominoAtSide(currentTetromino, deltaSide)
  ) {
    move(deltaSide);
  }
};

const moveLeft = () => moveSide(0, -1);
const moveRight = () => moveSide(width - 1, 1);

// const moveLeft = function () {
//   if (currentPosition < 0) return;
//   if (
//     !isAtLeftEdge(currentTetromino) &&
//     !hasTetrominoAtLeft(currentTetromino)
//   ) {
//     move(-1);
//   }
// };

// const moveRight = function () {
//   if (currentPosition < 0) return;
//   if (
//     !isAtRightEdge(currentTetromino) &&
//     !hasTetrominoAtRight(currentTetromino)
//   ) {
//     move(1);
//   }
// };

const rotate = function () {
  //   console.log("rotate");
  let nextRotation = currentRotation + 1;
  if (nextRotation === tetrominoes[currentShape].length) nextRotation = 0;
  const nextTetromino = tetrominoes[currentShape][nextRotation];
  if (
    !(
      (isAtEdge(nextTetromino, 0) && isAtEdge(nextTetromino, width - 1)) ||
      //   (isAtLeftEdge(nextTetromino) && isAtRightEdge(nextTetromino)) ||
      cannotBeDisplayedAtCurrentPosition(nextTetromino)
    )
  ) {
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
let currentShape, currentRotation, currentTetromino, currentPosition;
loadAndRenderNewTetromino();
let timerId = setInterval(moveDown, 1000);
document.addEventListener("keydown", applyTransformation);

startBtn.addEventListener("click", function () {
  if (!timerId) timerId = setInterval(moveDown, 500);
  else clearTimer();
});
