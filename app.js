document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));   // Array.from function puts all the divs into an array
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;

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
timerId = setInterval(moveDown,1000)

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
    random = Math.floor(Math.random() * theTetrominos.length)
    current = theTetrominos[random][currentRotation]
    currentPosition = 4
    draw()
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



})