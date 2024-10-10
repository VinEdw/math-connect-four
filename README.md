# math-connect-four

> It's *Connect 4*, but with math!

Imagine the game *Connect 4*, but in order to place your piece, you have to correctly solve a quick math problem.
Otherwise, your turn is skipped and your opponent can get ahead.

If you have any questions or suggestions, [email me](mailto:mister.man489@gmail.com?subject=Math%20Connect%20Four) or open an issue on this repository.

[KaTeX](https://katex.org/) is utilized for the Math Typesetting.

## Problem Sets

You are able to create your own problem sets to use with this game.
Such problem sets are stored in a `.json` file with the following structure:

```json
[
  {
    "question": "question text",
    "possible-answers": [
      "possible answer 1",
      "possible answer 2"
    ]
  },
  // Repeat the above section in curly braces for each question
  // Make sure to remove the comma after the closing brace of the last question 
]
```

The JSON file you wish to use should be selected in the form on the startup page.
These questions will be randomly used throughout the games.
It will avoid repeating a problem until all the problems have been gone through.

In the question text, math expressions between ``$` `` and `` `$`` will be rendered inline while math equations between `$$` and `$$` will be rendered block-level.
See the [KaTeX reference sheet](https://katex.org/docs/supported) for supported math expressions.
If you would like to include a backslash in a string, such as when creating math expressions, use `\\`.
If you would like to include a newline character in a string, such as when listing out multiple choice options, use `\n`.

There are a few pre-made problems sets in the `problem-sets` folder.

For those not familiar with JSON, make sure to remove trailing commas on the last element of an array or the last key-value pair of an object.

## Use Instructions

Currently this [mini website](https://vinedw.github.io/math-connect-four/) is hosted via GitHub Pages.
If you wish to use it yourself, you would have to create a JSON problem set or download an existing one.
Next, you go to the site and select the JSON problem set you wish to use.
Afterwards, the game board will load in with questions randomly picked.
The browser console will print the possible answers for the question whenever a column is selected.

The game was designed for a tutor to split their students into 2 teams.
After the team taking their turn (the active team) has been given enough time to choose a column to drop their piece and have agreed upon the answer, the opposing team chooses one member of the active team to share their answer with the tutor.
The tutor takes care of all the controls, inputting the teams' answers with proper formatting.
If the team gets the answer correct, their piece gets dropped into the slot.
If their answer is incorrect, the piece is not dropped and their turn is over.
Note that incorrectly answered questions remain on the board until they are answered correctly.

The tutor might periodically ask the teams to explain how they reached a correct answer to the rest of the students.
The teams should also be encouraged to collaborate with each other, both on the math and the game strategy.
The first team to get 4 of their colored pieces in a row (either horizontal, vertical, or diagonal) wins the round.
The page does not keep track of score.
A tutor might track score manually on a whiteboard in the classroom if they wish.
