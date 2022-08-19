// question functionality
const questions = {
  master: [],
  notInUse: [],
  inUse: [],

  initializeQuestions(fileText) {
    const fileJson = JSON.parse(fileText);
    for (let i = 0; i < fileJson.length; i++) {
      const question = fileJson[i];
      question.index = i;
    }
    this.master = [...fileJson];
    this.notInUse = [...fileJson];
  },

  getQuestionByIndex(i) {
    return this.master[i];
  },

  getRandomQuestion() {
    if (this.notInUse.length === 0) {
      const inUseIdices = this.inUse.map(question => question.index);
      for (let i = 0; i < this.master.length; i++) {
        const question = this.master[i];
        if (!inUseIdices.includes(question.index)) {
          this.notInUse.push(question);
        }
      }
    }
    const randomNumber = Math.floor(Math.random() * this.notInUse.length);
    const question = this.notInUse.splice(randomNumber, 1)[0];
    this.inUse.push(question);
    return question;
  },

  removeQuestionFromUse(question) {
    for (let i = 0; i < this.inUse.length; i++) {
      const cell = this.inUse[i];
      if (cell.index === question.index) {
        this.inUse.splice(i, 1);
        break;
      }
    }
  },

};

// set up question file form submission handler
const questionForm = document.getElementById("question-file-form");
questionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.composedPath()[0];
  const fileInputElement = document.getElementById("question-file-input");
  const file = fileInputElement.files[0];
  file.text().then((text) => {
    questions.initializeQuestions(text);
    form.remove();
    createBoard();
  });
});

// create the game board
function createBoard() {
  const width = 7;
  const height = 6;

  const columnPicker = document.createElement("div");
  columnPicker.id = "column-picker"
  for (let j = 0; j < width; j++) {
    const cell = document.createElement("div");
    cell.dataset.columnFilled = 0;
    cell.dataset.columnIndex = j;
    cell.dataset.targeted = 0;
    getNewQuestionForColumnPickerChild(cell);
    cell.addEventListener("click", columnPickerHandler);
    columnPicker.append(cell);
  }
  document.body.append(columnPicker);

  const table = document.createElement("table");
  table.id = "game-board";
  const tbody = document.createElement("tbody");
  table.append(tbody)
  for (let i = 0; i < height; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("td");
      cell.dataset.piece = 0;
      row.append(cell);
    }
    tbody.append(row);
  }
  document.body.append(table);
}

function columnPickerHandler(e) {
  let index;
  for (let i = 0; i < e.composedPath().length; i++) {
    const element = e.composedPath()[i];
    if (element.id === "column-picker") {
      index = i - 1;
    }
  }
  const columnPickerChild = e.composedPath()[index];
  if (columnPickerChild.dataset.columnFilled == 1) {
    return;
  }
  deTargetColumnPickerChildren();
  columnPickerChild.dataset.targeted = 1;
  const question = questions.getQuestionByIndex(columnPickerChild.dataset.questionIndex);
  const popUp = document.getElementById("answer-submission-pop-up");
  const questionLabel = document.getElementById("question-label");
  const answerInput = document.getElementById("answer-input");
  katex.render(question.question, questionLabel, {throwOnError: false});
  answerInput.value = "";
  console.log(question["possible-answers"]);
  popUp.dataset.hidden = 0;
  answerInput.focus();
}

function deTargetColumnPickerChildren() {
  const columnPicker = document.getElementById("column-picker");
  for (const cell of columnPicker.children) {
    cell.dataset.targeted = 0;
  }
}

function getTargetedColumnPickerChild() {
  return document.querySelector('#column-picker div[data-targeted="1"]');
}

function getNewQuestionForColumnPickerChild(columnPickerChild) {
  if (columnPickerChild.dataset.questionIndex !== undefined) {
    const oldQuestion = questions.getQuestionByIndex(columnPickerChild.dataset.questionIndex);
    questions.removeQuestionFromUse(oldQuestion);
  }
  const newQuestion = questions.getRandomQuestion();
  columnPickerChild.dataset.questionIndex = newQuestion.index;
  katex.render(newQuestion.question, columnPickerChild, { throwOnError: false });
}

// set up the pop up
const popUpForm = document.querySelector("#answer-submission-pop-up form");
popUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const popUp = document.getElementById("answer-submission-pop-up");
  const targetedColumnPickerChild = getTargetedColumnPickerChild();
  const question = questions.getQuestionByIndex(targetedColumnPickerChild.dataset.questionIndex);
  const answer = document.getElementById("answer-input").value;
  popUp.dataset.hidden = 1;
  if (question["possible-answers"].includes(answer)) {
    getNewQuestionForColumnPickerChild(targetedColumnPickerChild);
    dropPiece();
  }
  swapActivePlayer();
  deTargetColumnPickerChildren();
  const winState = checkForWin();
  if(winState) {
    setTimeout( () => {
      alert(`Team ${winState} Won!`);
      clearBoard();
    }, 1000);
  }
});

const popUpCloseButton = document.querySelector("#answer-submission-pop-up #close-button");
popUpCloseButton.addEventListener("click", (e) => {
  const popUp = document.getElementById("answer-submission-pop-up");
  popUp.dataset.hidden = 1;
  deTargetColumnPickerChildren();
});

// game functionality
function getActivePlayer() {
  const banner = document.getElementById("team-banner");
  return banner.dataset.activePlayer;
}

function swapActivePlayer() {
  const banner = document.getElementById("team-banner");
  if (banner.dataset.activePlayer == 1) {
    banner.dataset.activePlayer = 2;
  }
  else if (banner.dataset.activePlayer == 2) {
    banner.dataset.activePlayer = 1;
  }
}

function dropPiece() {
  const targetedColumnPickerChild = getTargetedColumnPickerChild();
  const column = targetedColumnPickerChild.dataset.columnIndex;
  const color = getActivePlayer();
  const board = document.querySelector("#game-board tbody");
  for (let i = board.children.length - 1; i >= 0; i--) {
    const row = board.children[i];
    const cell = row.children[column];
    if (cell.dataset.piece == 0) {
      cell.dataset.piece = color;
      if (i === 0) {
        targetedColumnPickerChild.dataset.columnFilled = 1;
      }
      return true;
    }
  }
  return false;
}

function checkForWin() {
  function checkInDirection(grid, y, x, color, direction, streak) {
    const height = grid.length;
    const width = grid[0].length;
    let newX;
    let newY;
    switch (direction) {
      case 0: // up
        newX = x;
        newY = y - 1;
        break;
      case 1: // up and to the right
        newX = x + 1;
        newY = y - 1;
        break;
      case 2: // right
        newX = x + 1;
        newY = y;
        break;
      case 3: // down and to the right
        newX = x + 1;
        newY = y + 1;
        break;
    }
    if ((newX < 0 || newX >= width) || (newY < 0 || newY >= height)) {
      return streak;
    }
    const newColor = grid[newY][newX];
    if (newColor != color) {
      return streak;
    }
    return checkInDirection(grid, newY, newX, color, direction, streak + 1);
  };

  const simplifiedBoard = [];
  const boardRows = document.querySelectorAll("#game-board tr");
  for (const row of boardRows) {
    const simplifiedRow = [];
    for (const cell of row.children) {
      simplifiedRow.push(Number.parseInt(cell.dataset.piece, 10));
    }
    simplifiedBoard.push(simplifiedRow);
  }

  for (let i = 0; i < simplifiedBoard.length; i++) {
    for (let j = 0; j < simplifiedBoard[i].length; j++) {
      let color = simplifiedBoard[i][j];
      if (color !== 0) {
        for (let d = 0; d < 4; d++) {
          let streak = checkInDirection(simplifiedBoard, i, j, color, d, 1);
          if (streak >= 4) {
            return color;
          }
        }
      }
    }
  }
  return 0;
}

function clearBoard() {
  const cells = document.querySelectorAll("#game-board td");
  for (const cell of cells) {
    cell.dataset.piece = 0;
  }
  const columnPicker = document.getElementById("column-picker");
  for (const item of columnPicker.children) {
    item.dataset.columnFilled = 0;
  }
}
