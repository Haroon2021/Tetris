document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));   // Array.from function puts all the divs into an array
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId ;    // This lets the timer Id be null
    let score = 0;

    //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]
  
  const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly add a tetromino
  let random = Math.floor(Math.random()*theTetrominos.length)
  let current = theTetrominos[random][currentRotation]

  // Draw the tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

// Undraw the Tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino')
  })
}

//Make the tetrominos move down every second (or any other time interval)
// timerId = setInterval(moveDown,1000)

// assign function to keycodes 
// (keycodes help work out what button is being pressed): https://www.toptal.com/developers/keycode/for/arrow-up
function control(e) {
  if(e.keyCode === 37) {      // Keycode 37 is the left arrow key
    moveLeft()
  } else if (e.keyCode === 38) {  // Keycode 38 is the up key
    rotate()
  } else if (e.keyCode === 39) {
    moveRight()
  } else if (e.keyCode === 40) {
    moveDown()
  }
}
document.addEventListener('keyup', control)

function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}

// Freeze function 

function freeze() {
  if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    // Start a new Tetromino from falling

    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominos.length)
    current = theTetrominos[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore();
  }
}

// Move the tetromino left unless it is at the edge or there is a blockage
function moveLeft() {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

  if(!isAtLeftEdge) currentPosition -= 1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1
  }

  draw()
}

// Move the tetromino to the right, unless it is at the right wall or there is a blockage

function moveRight() {
  undraw()
  const isAtRightEdge = current.some( index => (currentPosition + index ) % width === width - 1)

  if(!isAtRightEdge) currentPosition += 1

  if(current.some(index => squares[currentPosition + index ].classList.contains('taken'))) {
    currentPosition -= 1
  }
  draw()
}

//Rotate the tetromino
function rotate() {
  undraw()
  currentRotation ++
  if(currentRotation === current.length) { // if the current rotation is 4 make it go back to 0
    currentRotation = 0
  }
  current = theTetrominos[random][currentRotation]
  draw()
}
// Show up next tetromino in mini-grid displayed
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// the Tetromino without rotations, for displaying on the mini grid
const upNextTetrominoes = [
  [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
  [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
  [0, 1, displayWidth, displayWidth+1], //oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

// Display the shape in the minigrid

function displayShape() {
  //Remove any trace of the tetrominio from the entire grid
  displaySquares.forEach(square => {
      square.classList.remove('tetromino')
  })
  
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
  })
}

// Add functionality to the start button
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominos.length)
    displayShape()
  }
})

// Add Score function
function addScore() {
  for (let i=0; i<199; i += width) {
    const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
    
    if(row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}








})