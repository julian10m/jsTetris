# jsTetris

A tetris built with js following this [tutorial](https://youtu.be/rAUn1Lom6dw).

I do realize now that I actually introduced quite a few modifications, so here I leave them listed below, sorted by relevance:

 - I changed the way the tetrominos were being rendered: in the original solution, the user could not move the tetromino to the sides right before it was marked as taken. With my change, this is now possible, and resembles better the playability observed in other Tetris. Then, just as a matter of taste, but I preferred the 'keydown' to the 'keyup' approach to allow the user to move the tetrominos.
 - I fixed a bug which was eventually causing tetrominos being rotated to overflow on one side, and thus partially appear on the other one. Later, I saw that someone else had also realized about this problem, but I believe that my solution is clearly simpler and more human-friendly to read. In short, it is just enough to check whether the tetromino is simultaneously at the left and right edges of the grid.
- I fixed a bug where the original code was trying to compare the number of possible rotations of a tetromino but actually compared with the number of elements that compose each tetromino. This bug caused no real problem on the original code, since for the current solution, the numbers are the same. However, clearly, nothing really enforces that this equality should hold, and thus it should be changed simply for correctness.
- I abstracted the left/right actions and verifications into unique functions that can be used for both objectives. In order to be able to implement moveLeft and moveRight with the same underlying function, I tossed the functions that were checking for each side in particular. I like the abstraction, but at the same time I feel we lose interpretability. I am not yet convinced of which we should prioritize.
- I do not rely on extra hidden divs before and after the grid to identify when the tetrominos should either appear or be fixed. Instead, I simply check whether the index of the tetromino being analized is a valid index of the squares of the grid. In addition, I also generated some logic so that the tetrominos gradually appear on the grid, and not just appear at once, as it was originally done.
 
