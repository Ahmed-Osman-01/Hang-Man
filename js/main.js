fetch("../JSON/words.json")
  .then((response) => response.json())
  .then((data) => {
    startEveryThing(data);
  });

function startEveryThing(words) {
  // select the header class and description
  let classSpan = document.querySelector(".word-class span");
  let descriptionSpan = document.querySelector(".description span");

  // Get a random word object
  let randomWord = pickRandomWord(words);

  // Add the random word class and description to the header of the game
  classSpan.innerHTML = randomWord.class;
  descriptionSpan.innerHTML = randomWord.description;

  // Generate the letters into the main content of the game
  generateLetters();
  // Generates the area for guessed letters
  generateGuessArea(randomWord.word);
  // handle everything after selecting a letter
  handleClickEvents(randomWord);
}

// Picks a random word object from the fetched words
function pickRandomWord(words) {
  let randomNumber = Math.floor(Math.random() * words.length);

  return words[randomNumber];
}

function generateLetters() {
  let letters = Array.from("abcdefghijklmnopqrstuvwxyz");

  // selecting the letters area
  let lettersArea = document.querySelector(".letters");
  // creating the letter span(box) and appending it to the letters area
  letters.forEach((letter) => {
    let span = document.createElement("span");
    span.className = "letter-box";
    span.appendChild(document.createTextNode(letter.toUpperCase()));
    lettersArea.appendChild(span);
  });
}

function generateGuessArea(words) {
  // checks if the word contains more than one word separated by space and add each word to
  // element in the words array
  let wordsArr = words.split(" ");
  // select the guess area to add each word to it
  let guessArea = document.querySelector(".guess-area");
  // loop on the array of words to add a special div for each word
  wordsArr.forEach((word) => {
    let wordToGuessArea = document.createElement("div");
    wordToGuessArea.className = "word-guess-area";
    // convert the current word in the words array into an array and loop throug it to create
    // the spaces for the word to be guessed
    let arrWord = Array.from(word);
    arrWord.forEach((letter) => {
      let span = document.createElement("span");
      wordToGuessArea.appendChild(span);
    });
    // append each word area into the main guesing area
    guessArea.appendChild(wordToGuessArea);
  });
}

// function to handle everything about clicking the letter (basically the main game logic)
function handleClickEvents(randomWord) {
  // select the drawing element to pass it to the function if correct = false
  let drawing = document.querySelector(".drawing");
  let mistakes = 0;
  // the number of correct guesses so it will be compared with the word length
  let guessedCount = 0;
  document.onclick = function (e) {
    if (e.target.className === "letter-box") {
      // to make the letter clickable once only
      clickOnLetterOnce(e.target);
      // the letter that have been clicked on
      let clickedLetter = e.target.textContent;
      // get the word from random word object and convert it into an array
      let words = Array.from(randomWord.word);
      // pass the clicked letter and the word/s to the check function which returns
      // whether the clicked letter is correct or not and the count of the letters found per
      //  click if found any
      let { correct, count } = checkClickedLetter(words, clickedLetter);
      // increament the number of guessed letters per count to the total guessed count
      guessedCount += count;

      if (guessedCount === randomWord.word.length) {
        wonGame();
      }
      // if the clicked letter is not correct then increment the mistakes and invoke
      if (!correct) {
        mistakes++;
        wrongLetterSelected(mistakes, drawing);
      }
    }
  };
}

function clickOnLetterOnce(target) {
  // the class clicked in css has property pointer-events: none;
  target.classList.add("clicked");
}

// checks if the selected letter is from the random word letters and if true it puts this letter
// in its guessing place and returns true (correct)
function checkClickedLetter(words, clickedLetter) {
  let count = 0;
  let correct = false;
  // filer the word/words from any space
  words = words.filter((e) => e !== " ");
  // select the guess letter spaces
  let guessSpaces = document.querySelectorAll(".guess-area span");
  // loop throuh each letter in the word/s and compare this letter to the clicked letter
  // if the current letter = clicked letter then add this letter to where it should be in the
  // guessing spaces
  // note: we filter the word from spaces becuase we don't have empty letter guessing spaces
  // we have new lines instead and we did that filter so that the index of the current looped
  // letter = the index where this letter should be in the guessing spaces
  words.forEach((letter, index) => {
    if (clickedLetter.toLowerCase() === letter) {
      guessSpaces[index].textContent = clickedLetter;
      correct = true;
      // for each letter added in guessing spaces increase the count by 1
      count++;
    }
  });
  return {
    correct,
    count,
  };
}
// add a mistake class to the drawing to draw the hang man and check if mistakes = 9 to end the game
function wrongLetterSelected(mistakes, drawing) {
  drawing.classList.add(`mistake-${mistakes}`);
  if (mistakes === 9) {
    gameOver();
  }
}

function gameOver() {
  // disable clicking in the game
  let letters = document.querySelector(".letters");
  letters.classList.add("stop-game");

  // add cover to the background of game over popup
  let cover = document.createElement("div");
  cover.className = "cover";
  document.body.appendChild(cover);
  // create the popup
  let popUp = document.createElement("div");
  popUp.className = "pop-up";
  let youLost = document.createElement("span");
  youLost.className = "you-lost";
  youLost.appendChild(document.createTextNode("You lost"));
  popUp.appendChild(youLost);
  let playAgain = document.createElement("span");
  playAgain.className = "play-again";
  playAgain.appendChild(document.createTextNode("Play Again"));
  playAgain.addEventListener("click", () => location.reload());
  popUp.appendChild(playAgain);
  document.body.appendChild(popUp);
}

function wonGame() {
  // disable clicking in the game
  let letters = document.querySelector(".letters");
  letters.classList.add("stop-game");
  // add cover to the background of game over popup
  let cover = document.createElement("div");
  cover.className = "cover";
  document.body.appendChild(cover);
  // create the popup
  let popUp = document.createElement("div");
  popUp.className = "pop-up";
  let youWon = document.createElement("span");
  youWon.className = "you-won";
  youWon.appendChild(document.createTextNode("You Won"));
  popUp.appendChild(youWon);
  let playAgain = document.createElement("span");
  playAgain.className = "play-again";
  playAgain.appendChild(document.createTextNode("Play Again"));
  playAgain.addEventListener("click", () => location.reload());
  popUp.appendChild(playAgain);
  document.body.appendChild(popUp);
}
