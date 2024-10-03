// question functionality
const questions = {
  master: [],
  notInUse: [],
  inUse: [],
  questionForm: document.getElementById("question-file-form"),
  
  init() {
    // set up question file form submission handler
    this.questionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fileInputElement = document.getElementById("question-file-input");
      const file = fileInputElement.files[0];
      file.text().then((text) => {
        questions.initializeQuestions(text);
        this.questionForm.remove();
        columnPicker.init();
        gameBoard.init();
      });
    });
  },

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
      // If all the questions are in use, then put them all up for reuse
      if (this.notInUse.length === 0) {
        for (const question of this.master) {
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
questions.init();

const gameBoard = {
  width: 7,
  height: 6,
  element: undefined,

  init() {
    const table = document.createElement("table");
    table.id = "game-board";
    const tbody = document.createElement("tbody");
    table.append(tbody)
    for (let i = 0; i < this.height; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < this.width; j++) {
        const cell = document.createElement("td");
        cell.dataset.piece = 0;
        row.append(cell);
      }
      tbody.append(row);
    }
    document.body.append(table);
    this.element = document.getElementById(table.id);
  },

  dropPiece() {
    const cell = columnPicker.getTarget();
    const column = cell.dataset.columnIndex;
    const color = teamBanner.getActivePlayer();
    const board = this.element.querySelector("tbody");
    for (let i = board.children.length - 1; i >= 0; i--) {
      const row = board.children[i];
      const slot = row.children[column];
      if (slot.dataset.piece == 0) {
        slot.dataset.piece = color;
        if (i === 0) {
          cell.dataset.columnFilled = 1;
        }
        return true;
      }
    }
    return false;
  },

  clearBoard() {
    const cells = document.querySelectorAll("#game-board td");
    for (const cell of cells) {
      cell.dataset.piece = 0;
    }
    const columnPicker = document.getElementById("column-picker");
    for (const item of columnPicker.children) {
      item.dataset.columnFilled = 0;
    }
  },

  checkForWin() {
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
    const boardRows = this.element.querySelectorAll("tr");
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
  },
};

const columnPicker = {
  width: 7,
  element: undefined,
  init() {
    const columnPicker = document.createElement("div");
    columnPicker.id = "column-picker"
    columnPicker.addEventListener("click", this.clickHandler);
    for (let j = 0; j < this.width; j++) {
      const cell = document.createElement("div");
      cell.dataset.columnFilled = 0;
      cell.dataset.columnIndex = j;
      cell.dataset.targeted = 0;
      this.getNewQuestion(cell);
      columnPicker.append(cell);
    }
    document.body.append(columnPicker);
    this.element = document.getElementById(columnPicker.id);
  },

  getTarget() {
    return this.element.querySelector('div[data-targeted="1"]');
  },

  deTargetAll() {
    for (const cell of this.element.children) {
      cell.dataset.targeted = 0;
    }
  },

  clickHandler(e) {
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
    columnPicker.deTargetAll();
    columnPickerChild.dataset.targeted = 1;
    const questionIndex = columnPickerChild.dataset.questionIndex;
    popUp.loadQuestion(questionIndex);
  },

  getNewQuestion(cell) {
    if (cell.dataset.questionIndex !== undefined) {
      const oldQuestion = questions.getQuestionByIndex(cell.dataset.questionIndex);
      questions.removeQuestionFromUse(oldQuestion);
    }
    const newQuestion = questions.getRandomQuestion();
    cell.dataset.questionIndex = newQuestion.index;
    cell.textContent = Number.parseInt(cell.dataset.columnIndex, 10) + 1;
  },

};

const teamBanner = {
  element: document.getElementById("team-banner"),
  getActivePlayer() {
    return this.element.dataset.activePlayer;
  },
  swapActivePlayer() {
    const activePlayer = this.getActivePlayer();
    if (activePlayer == 1) {
      this.element.dataset.activePlayer = 2;
    }
    else if (activePlayer == 2) {
      this.element.dataset.activePlayer = 1;
    }
  },
};

const popUp = {
  element: document.getElementById("answer-submission-pop-up"),
  form: document.querySelector("#answer-submission-pop-up form"),
  questionLabel: document.getElementById("question-label"),
  answerInput: document.getElementById("answer-input"),
  closeButton: document.getElementById("close-button"),
  
  init() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const cell = columnPicker.getTarget();
      const question = questions.getQuestionByIndex(cell.dataset.questionIndex);
      const answer = popUp.answerInput.value;
      popUp.hide();
      if (question["possible-answers"].includes(answer)) {
        columnPicker.getNewQuestion(cell);
        gameBoard.dropPiece();
      }
      teamBanner.swapActivePlayer();
      columnPicker.deTargetAll();
      const winState = gameBoard.checkForWin();
      if(winState) {
        setTimeout( () => {
          alert(`Team ${winState} Won!`);
          gameBoard.clearBoard();
        }, 1000);
      }
    });

    this.closeButton.addEventListener("click", (e) => {
      popUp.hide();
      columnPicker.deTargetAll();
    });
  },

  hide() {
    this.element.dataset.hidden = 1;
  },
  show() {
    this.element.dataset.hidden = 0;
  },
  loadQuestion(i) {
    const question = questions.getQuestionByIndex(i);
    this.questionLabel.textContent = question.question;
    renderMathInElement(this.questionLabel, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$`', right: '`$', display: false},
      ],
      throwOnError : false,
    });
    this.answerInput.value = "";
    this.show();
    this.answerInput.focus();
    console.log(question["possible-answers"]);
  },
};
popUp.init()
