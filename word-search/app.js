window.onload = init;

let directions;

function init() {
  let wordList = [
    'dog',
    'cat',
    'bird',
    'cheetah',
    'gorilla',
    'giraffe',
    'elephant',
    'monkey',
    'tiger',
    'lion',
    'lizard',
    'rhino',
    'hippopotamus',
    'connor',
    'luna'
  ]

  let gridSizeY = 20;
  let gridSizeX = 20;

  // create class of direction objects that specify x and y direction. e.g. UP would be (x: 0, y: -1)
  directions = new Directions();

  // initialize empty grid
  const puzzleGrid = initGrid(gridSizeX, gridSizeY);

  console.log(JSON.stringify(puzzleGrid));

  // sort word list by largest word first
  wordList
    .sort((a, b) => a.length > b.length ? -1 : 1)
    .forEach(word => {
      console.log(word);
      placeWord(word, puzzleGrid);
    });

  // write array to DOM
  renderPuzzle(puzzleGrid, wordList);

  // future: come up with more clever algorithm that figures out how to work with more letters in more compact grid. That is, more intentionally combining words that share letters, if necessary
};

function initGrid(gridSizeX, gridSizeY) {
  const puzzleGrid = [];

  for (i = 0; i < gridSizeY; i++) {
    const row = [];
    for (j = 0; j < gridSizeX; j++) {
        row.push(null);
    }
    puzzleGrid.push(row);
  }

  return puzzleGrid;
}

//select a random starting point coordinate set (one number for x, one for y) and a direction.
function placeWord(word, puzzleGrid) {
  //randomly select x
  const startingX = Math.ceil(Math.random() * puzzleGrid[0].length);
  console.log('x: ' + startingX);

  //randomly select y
  const startingY = Math.ceil(Math.random() * puzzleGrid.length);
  console.log('y: ' + startingY);

  //randomly select direction
  const numberOfDirections = directions.length;
  const directionIndex = Math.ceil(Math.random() * (numberOfDirections - 1));
  direction = directions[directionIndex];
  console.log('Direction: ' + JSON.stringify(direction));

  //recursively check validity of all letter placements. If successful, place all. If unsuccessful, increment direction index by 1, and try again
  let tries = 0;
  const wordPlaced = false;
  while (!wordPlaced) {
    tries++;
    const wordPlaced = placeLetter(word, startingX, startingY, direction, puzzleGrid);
    if (wordPlaced) {
      return true;
    } 

    if (!wordPlaced && tries < numberOfDirections) {
      direction = directionIndex < direction.length ? directions[++directionIndex] : 0;
    } else {
      // tried all directions. Try another spot
      return placeWord(word, puzzleGrid)
    }
  }
}

function placeLetter(word, x, y, direction, puzzleGrid, letterIndex = 0) {
  const currentLetter = word.charAt(letterIndex);
  const isEndOfWord = letterIndex === word.length - 1;
  const _isValidLetterPlacement = isLetterPlacementValid(currentLetter, x, y, puzzleGrid);

  if (!_isValidLetterPlacement) {
    return false;
  }

  if ((isEndOfWord || 
      placeLetter(word, x + direction.x, y + direction.y, direction, puzzleGrid, letterIndex + 1)) &&
      _isValidLetterPlacement)
  {
    puzzleGrid[y][x] = currentLetter;
    return true;
  }
}

function isLetterPlacementValid(letter, x, y, puzzleGrid) {
  return x + 1 <= puzzleGrid[0].length &&
    y + 1 <= puzzleGrid.length &&
    x >= 0 &&
    y >= 0 &&
    (puzzleGrid[y][x] === null || puzzleGrid[y][x] === letter); 
}

function renderPuzzle(puzzleGrid, wordList) {
  let wordListHtml = wordList
    .map(word => `<li>${word}</li>`)
    .join('');

  document.getElementById('word-list').innerHTML = wordListHtml;

  let puzzleContainerHtml = '<table>';

  puzzleGrid.forEach(row => {
    puzzleContainerHtml += '<tr>';
    row.forEach(letter => {
      puzzleContainerHtml += `<td>${letter || getRandomLetter()}</td>`;
    });
    puzzleContainerHtml += '</tr>';
  });
  puzzleContainerHtml += '</table>';
  
  const puzzleContainerElement = document.getElementById('puzzle-container');
  puzzleContainerElement.innerHTML = puzzleContainerHtml;
}

function getRandomLetter() {
  const letterNumber = Math.ceil(Math.random() * 26) + 96;
  return String.fromCharCode(letterNumber);
}