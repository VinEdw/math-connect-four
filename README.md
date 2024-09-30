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
  // repeat the above section in curly braces for each question
]
```

The JSON file you wish to use should be selected in the form on the startup page.
These questions will be randomly used throughout the games.
It will avoid repeating a problem until all the problems have been gone through.

There are two pre-made problems sets in the `problem-sets` folder.
One has some simple trig evaluation questions, while the other has some simple derivatives.

## Use Instructions

Currently this mini website is not hosted anywhere.
If you wish to use it yourself, you would have to download the files into a folder on your computer (or clone the repo) and open `index.html` in a web browser.
Next, you select the JSON problem set you wish to use.
Afterwards, the game board will load in with questions randomly picked.

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
